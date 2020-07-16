#include <iostream>
#include <boost/asio.hpp>
#include <boost/algorithm/string.hpp>
#include <string>
#include <memory>

using namespace boost;
using namespace boost::system;
using namespace boost::asio;

class session;

class http_headers
{
   std::string method;
   std::string url;
   std::string version;

   std::map<std::string, std::string> params;
   
   std::map<std::string, std::string> headers;

public:
   
   std::string get_response()
   {
      std::stringstream ssOut;
      if(url == "/")
      {
         ssOut << "HTTP/1.1 200 OK" << std::endl;
         ssOut << "content-type: text/html" << std::endl;

         std::string sHTML = "<html><body><h1>Hello there!</h1><p>Testing /</p>";
         for(auto it = params.begin(); it!=params.end(); it++){
            sHTML += "<p>Arg: " + it->first + " Value: " + it->second +"</p>";
         }
         sHTML += "</body></html>";
         ssOut << "content-length: " << sHTML.length() << std::endl;
         ssOut << std::endl;
         ssOut << sHTML;
      }

      else
      {
         std::string sHTML = "<html><body><h1>404 Not Found</h1><p>There's nothing here.</p></body></html>";
         ssOut << "HTTP/1.1 404 Not Found" << std::endl;
         ssOut << "content-type: text/html" << std::endl;
         ssOut << "content-length: " << sHTML.length() << std::endl;
         ssOut << std::endl;
         ssOut << sHTML;
      }
      return ssOut.str();
   }
   
    std::string on_internal_error() {
        std::stringstream ssOut;
        std::string sHTML = "<html><body><h1>500 Internal Error</h1><p>Something went wrong on the server</p></body></html>";
        ssOut << "HTTP/1.1 500 Internal Error" << std::endl;
        ssOut << "content-type: text/html" << std::endl;
        ssOut << "content-length: " << sHTML.length() << std::endl;
        ssOut << std::endl;
        ssOut << sHTML;
        return ssOut.str();
   }
   
   int content_length()
   {
      auto request = headers.find("content-length");
      if(request != headers.end())
      {
         std::stringstream ssLength(request->second);
         int content_length;
         ssLength >> content_length;
         return content_length;
      }
      return 0;
   }
   
   void on_read_header(std::string line)
   {
      std::cout << "header: " << line << std::endl;
      
      std::stringstream ssHeader(line);
      std::string headerName;
      std::getline(ssHeader, headerName, ':');
      
      std::string value;
      std::getline(ssHeader, value);
      headers[headerName] = value;
   }
   
   void on_read_request_line(std::string line)
   {
      std::stringstream ssRequestLine(line);

      ssRequestLine >> method;
      ssRequestLine >> url;
      ssRequestLine >> version;

      std::cout << "method: " << method << " ";
      std::cout << "url: " << url << " ";
      std::vector<std::string> temp;
      boost::split(temp,url,boost::is_any_of("?&="));
      url=temp[0];
      temp.erase(temp.begin());
      std::cout << "version: " << version << std::endl;
      for(auto it = temp.begin(); it!=temp.end(); it+=2) {
          params.insert(std::pair<std::string,std::string>(*it, *(it+1)));
      }
      for (std::map<std::string, std::string>::const_iterator it = params.begin(); it != params.end(); ++it) {
          std::cout << it->first << " " << it->second << " ";
      }

      std::cout << "request for resource: " << url << std::endl;
   }
};

class session
{
   asio::streambuf buff;
   http_headers headers;
   
   static void read_body(std::shared_ptr<session> pThis)
   {
      int nbuffer = 1000;
      std::shared_ptr<std::vector<char>> bufptr = std::make_shared<std::vector<char>>(nbuffer);
      asio::async_read(pThis->socket, boost::asio::buffer(*bufptr, nbuffer), [pThis](const error_code& e, std::size_t s)
      {
        //Handle stuff in body
      });
   }
   
   static void read_next_line(std::shared_ptr<session> pThis)
   {
      asio::async_read_until(pThis->socket, pThis->buff, '\r', [pThis](const error_code& e, std::size_t s)
      {
         std::string line, ignore;
         std::istream stream {&pThis->buff};
         std::getline(stream, line, '\r');
         std::getline(stream, ignore, '\n');

         pThis->headers.on_read_header(line);
         
         if(line.length() == 0)
         {
            if(pThis->headers.content_length() == 0)
            {
               std::shared_ptr<std::string> str = std::make_shared<std::string>(pThis->headers.get_response());
               asio::async_write(pThis->socket, boost::asio::buffer(str->c_str(), str->length()), [pThis, str](const error_code& e, std::size_t s)
               {
                  std::cout << "done" << std::endl;
               });
            }
            else
            {
               pThis->read_body(pThis);
            }
         }
         else
         {
            pThis->read_next_line(pThis);
         }
      });
   }
   
   static void read_first_line(std::shared_ptr<session> pThis)
   {
      asio::async_read_until(pThis->socket, pThis->buff, '\r', [pThis](const error_code& e, std::size_t s)
      {
         std::string line, ignore;
         std::istream stream {&pThis->buff};
         std::getline(stream, line, '\r');
         std::getline(stream, ignore, '\n');
         pThis->headers.on_read_request_line(line);
         pThis->read_next_line(pThis);
      });
   }

   static void send_internal_error(std::shared_ptr<session> pThis)
   {
               std::shared_ptr<std::string> str = std::make_shared<std::string>(pThis->headers.on_internal_error());
               asio::async_write(pThis->socket, boost::asio::buffer(str->c_str(), str->length()), [pThis, str](const error_code& e, std::size_t s)
               {
                  std::cout << "done" << std::endl;
               });
   }
   
public:

   ip::tcp::socket socket;
   
   session(io_service& io_service)
      :socket(io_service)
   {
   }
   
   static void interact(std::shared_ptr<session> pThis) try
   {
            read_first_line(pThis);
   } catch (const std::exception& e) {
            send_internal_error(pThis);
   }
};

void accept_and_run(ip::tcp::acceptor& acceptor, io_service& io_service)
{
   std::shared_ptr<session> sesh = std::make_shared<session>(io_service);
   acceptor.async_accept(sesh->socket, [sesh, &acceptor, &io_service](const error_code& accept_error)
   {
      accept_and_run(acceptor, io_service);
      if(!accept_error)
      {
         session::interact(sesh);
      }
   });
}

int main(int argc, const char * argv[])
{
   io_service io_service;
   ip::tcp::endpoint endpoint{ip::tcp::v4(), 8080};
   ip::tcp::acceptor acceptor{io_service, endpoint};
   
   acceptor.listen();
   accept_and_run(acceptor, io_service);
   
   io_service.run();
   return 0;
}
