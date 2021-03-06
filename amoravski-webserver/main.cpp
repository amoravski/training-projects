#include <ctime>
#include <iostream>
#include <string>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;

class session;
class http_headers;

void accept_and_run(tcp::acceptor& acceptor, boost::asio::io_service& io_service) {
    std::shared_ptr<session> sesh = std::make_shared<session>(io_service);

}

int main()
{
    boost::asio::io_service io_service;
    tcp::acceptor acceptor(io_service, tcp::endpoint(tcp::v4(), 8080));
    acceptor.listen();
    return 0;
}

class session
{
    boost::asio::streambuf buff;
   http_headers headers;
   
   static void read_body(std::shared_ptr<session> pThis)
   {
      int nbuffer = 1000;
      std::shared_ptr<std::vector<char>> bufptr = 
         std::make_shared<std::vector<char>>(nbuffer);
      boost::asio::async_read(pThis->socket, boost::asio::buffer(*bufptr, nbuffer),
      [pThis](const error_code& e, std::size_t s)
      {
      });
   }
   
   static void read_next_line(std::shared_ptr<session> pThis)
   {
       boost::asio::async_read_until(pThis->socket, pThis->buff, '\r',
      [pThis](const error_code& e, std::size_t s)
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
               std::shared_ptr<std::string> str =
                  std::make_shared<std::string>(pThis->headers.get_response());
               asio::async_write(
                  pThis->socket,
                  boost::asio::buffer(str->c_str(), str->length()),
                  [pThis, str](const error_code& e, std::size_t s)
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
       boost::asio::async_read_until(pThis->socket, pThis->buff, '\r',
      [pThis](const error_code& e, std::size_t s)
      {
         std::string line, ignore;
         std::istream stream {&pThis->buff};
         std::getline(stream, line, '\r');
         std::getline(stream, ignore, '\n');
         pThis->headers.on_read_request_line(line);
         pThis->read_next_line(pThis);
      });
   }
   
public:

   tcp::socket socket;
   
   session(io_service& io_service)
      :socket(io_service)
   {
   }
   
   static void interact(std::shared_ptr<session> pThis)
   {
      read_first_line(pThis);
   }
};

class http_headers
{
   std::string method;
   std::string url;
   std::string version;
   
   std::map<std::string, std::string> headers;

public:
   
   std::string get_response()
   {
      std::stringstream ssOut;
      if(url == "/favicon.ico")
      {
         int nSize = 0;
         unsigned char* data = get_icon(&nSize);
         
         ssOut << "HTTP/1.1 200 OK" << std::endl;
         ssOut << "content-type: image/vnd.microsoft.icon" << std::endl;
         ssOut << "content-length: " << nSize << std::endl;
         ssOut << std::endl;
         
         ssOut.write((char*)data, nSize);
      }
      else if(url == "/")
      {
         std::string sHTML =
         "<html><body><h1>Hello World</h1><p>This is a web server in c++</p></body></html>";
         ssOut << "HTTP/1.1 200 OK" << std::endl;
         ssOut << "content-type: text/html" << std::endl;
         ssOut << "content-length: " << sHTML.length() << std::endl;
         ssOut << std::endl;
         ssOut << sHTML;
      }
      else
      {
         std::string sHTML =
         "<html><body><h1>404 Not Found</h1><p>There's nothing here.</p></body></html>";
         ssOut << "HTTP/1.1 404 Not Found" << std::endl;
         ssOut << "content-type: text/html" << std::endl;
         ssOut << "content-length: " << sHTML.length() << std::endl;
         ssOut << std::endl;
         ssOut << sHTML;
      }
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
      
      std::cout << "request for resource: " << url << std::endl;
   }
};
