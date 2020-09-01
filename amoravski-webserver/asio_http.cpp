#include <iostream>
#include <fstream>
#include <vector>
#include <experimental/filesystem>
#include <boost/asio.hpp>
#include <boost/process.hpp>
#include <boost/algorithm/string.hpp>
#include <string>
#include <memory>
#include <thread>

using namespace boost;
using namespace boost::system;
using namespace boost::asio;
namespace fs = std::experimental::filesystem;
namespace bp = boost::process;

class session;

class http_headers
{
    std::string method;
    std::string url;
    std::string version;

    std::map<std::string, std::string> params;

    std::map<std::string, std::string> body_params;

    std::map<std::string, std::string> headers;

public:

    std::string get_response()
    {
        std::stringstream ssOut;
        try {
            std::string format = url.substr(url.find_last_of(".")+1);
            if(url == "/" || url == "/index.html" )
            {
                ssOut << "HTTP/1.1 200 OK" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                ssOut << "content-type: text/html; charset=utf-8" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;

                std::string line;
                std::ifstream html_file ("index.html");
                fs::path p = fs::current_path() / "index.html";
                ssOut << "content-length: " << fs::file_size(p) << std::endl;
                ssOut << std::endl;

                if(html_file.is_open())
                {
                    while(getline(html_file,line))
                    {
                        ssOut << line << '\n';
                    }
                    html_file.close();
                }
            }

            else if(url!= "" && fs::exists(url.substr(1, std::string::npos)) && headers.find("Accept")->second.compare(std::string{"image/webp"}) && (format == "ico" || format == "png" || format == "jpg")) {
                ssOut << "HTTP/1.1 200 OK" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                ssOut << "content-type: image/webp" << std::endl;

                std::string line;
                std::ifstream html_file (url.substr(1, std::string::npos));
                fs::path p = fs::current_path() / url.substr(1, std::string::npos);
                ssOut << "content-length: " << fs::file_size(p) << std::endl;
                ssOut << std::endl;

                if(html_file.is_open())
                {
                    while(getline(html_file,line))
                    {
                        ssOut << line << '\n';
                    }
                    html_file.close();
                }
            }

            else if(url!= "" && fs::exists(url.substr(1, std::string::npos)) && format == "iso") {
                ssOut << "HTTP/1.1 200 OK" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                ssOut << "content-type: application/x-iso9660-image" << std::endl;

                std::string line;
                std::ifstream html_file (url.substr(1, std::string::npos));
                fs::path p = fs::current_path() / url.substr(1, std::string::npos);
                ssOut << std::endl;

                if(html_file.is_open())
                {
                    while(getline(html_file,line))
                    {
                        ssOut << line << '\n';
                    }
                    html_file.close();
                }
            }

            else if(url!="" && fs::exists(url.substr(1, std::string::npos)) && format == "cgi") {
                ssOut << "HTTP/1.1 200 OK" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                bp::ipstream is;
                auto env = boost::this_process::environment();
                for(auto i = params.begin(); i!=params.end(); i++)
                {
                    env[i->first] = i->second;
                }
                for(auto i = body_params.begin(); i!=body_params.end(); i++)
                {
                    env[i->first] = i->second;
                    std::cout << i->first << std::endl;
                    std::cout << i->second << std::endl;
                }
                
                bp::environment env_ = env;
                io_service ios;
                std::future<std::string> data;
                bp::child c("." + url, env_, bp::std_out > data, ios);
                ios.run();
                auto data_value = data.get();
                ssOut << data_value;
            }

            else if(url!= "" && fs::exists(url.substr(1, std::string::npos)))
            {
                ssOut << "HTTP/1.1 200 OK" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                ssOut << "content-type: text/html; charset=utf-8" << std::endl;

                std::string line;
                std::ifstream html_file (url.substr(1, std::string::npos));
                fs::path p = fs::current_path() / url.substr(1, std::string::npos);
                ssOut << "content-length: " << fs::file_size(p) << std::endl;
                ssOut << std::endl;

                if(html_file.is_open())
                {
                    while(getline(html_file,line))
                    {
                        ssOut << line << '\n';
                    }
                    html_file.close();
                }
            }

            else
            {
                std::string line;
                std::ifstream html_file ("404.html");
                fs::path p = fs::current_path() / "404.html";
                std::string sHTML = "<html><body><h1>404 Not Found</h1><p>There's nothing here.</p></body></html>";
                ssOut << "HTTP/1.1 404 Not Found" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
                ssOut << "content-type: text/html" << std::endl;
                ssOut << "content-length: " << fs::file_size(p) << std::endl;
                ssOut << std::endl;
                if(html_file.is_open())
                {
                    while(getline(html_file,line))
                    {
                        ssOut << line << '\n';
                    }
                    html_file.close();
                }
            }

            return ssOut.str();
        }
        catch (...) {
            return on_internal_error();
        }
    }

    std::string on_internal_error() {
        std::string line;
        std::ifstream html_file ("500.html");
        fs::path p = fs::current_path() / "500.html";
        std::stringstream ssOut;
        ssOut << "HTTP/1.1 500 Internal Error" << std::endl;
                ssOut << "server: sasho_webserver/1.2" << std::endl;
        ssOut << "content-type: text/html" << std::endl;
        ssOut << "content-length: " << fs::file_size(p) << std::endl;
        ssOut << std::endl;
        if(html_file.is_open())
        {
            while(getline(html_file,line))
            {
                ssOut << line << '\n';
            }
            html_file.close();
        }
        return ssOut.str();
    }

    int content_length()
    {
        auto request = headers.find("Content-Length");
        if(request != headers.end())
        {
            std::stringstream ssLength(request->second);
            int content_length;
            ssLength >> content_length;
            return content_length;
        }
        return 0;
    }

    std::string content_type()
    {
        auto request = headers.find("Content-Type");
        if(request != headers.end())
        {
            std::stringstream ssLength(request->second);
            std::string content_length;
            ssLength >> content_length;
            return content_length;
        }
        return "";

    }

    void on_read_header(std::string line)
    {
        //std::cout << "header: " << line << std::endl;

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
        std::cout << "version: " << version << std::endl;
        std::vector<std::string> temp;
        try {
            boost::split(temp,url,boost::is_any_of("?&="));
            url=temp[0];
            temp.erase(temp.begin());
            for(auto it = temp.begin(); it!=temp.end(); it+=2) {
                params.insert(std::pair<std::string,std::string>(*it, *(it+1)));
            }
        }
        catch (...){
            //std::cout << "Incorrectly formatted params, disregarding..." << std::endl;
        }

        //std::cout << "request for resource: " << url << std::endl;
    }

    void write_body_unencoded(std::istream &body) {
        std::string line;
        std::getline(body, line, '\r');
        std::vector<std::string> temp;
        try {
            boost::split(temp,line,boost::is_any_of("?&="));
            for(auto it = temp.begin(); it!=temp.end(); it+=2) {
                body_params.insert(std::pair<std::string,std::string>(*it, *(it+1)));
            }
        }
        catch (...){
            //std::cout << "Incorrectly formatted params, disregarding..." << std::endl;
        }
    }

    void write_body_multipart(std::istream &body) {
        std::vector<std::string> lines;
        std::string temp;
        std::string boundary = "--------------";
        while( std::getline(body, temp, '\n') ) {
            lines.push_back(temp);
        }
        std::string name="";
        std::string value="";
        bool readingHeaders = true;
        for(auto it = lines.begin()+1; it!=lines.end(); it++) {
            std::string current = *it;
            if(current.length() == 1) {
                readingHeaders = false;
            }
            else if(current.find(boundary)!=std::string::npos && readingHeaders == true) {
                readingHeaders=!readingHeaders;
                //std::cout << "Doggie inside!";
                continue;
            }
            else if(current.find(boundary)!=std::string::npos && readingHeaders== false) {
                body_params.insert(std::pair<std::string,std::string>(name, value));
                name = "";
                value = "";
                readingHeaders=!readingHeaders;
            }
            else if(readingHeaders == false) {
                value += current;
            }
            else if(readingHeaders == true) {
                name = current.substr(current.find("\"")+1);
                name = name.substr(0, name.find("\""));
            }
            //std::cout << current << std::endl;
        }
        return;
    }
};

class session
{
    asio::streambuf buff;
    http_headers headers;

    // Body
    static void read_body(std::shared_ptr<session> pThis)
    {
        std::string line, ignore;
        std::istream stream {&pThis->buff};
        //std::cout << line;
        std::string type = pThis->headers.content_type();
        //std::cout << type;
        if(type.find("application/x-www-form-urlencoded")!=std::string::npos){
            pThis->headers.write_body_unencoded(stream);
        }
        else if (type.find("multipart/form-data")!=std::string::npos){
            pThis->headers.write_body_multipart(stream);
        }
        else {
            //pThis->headers.write_body_unencoded(stream);
        }
    } 

    // Headers
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
                    std::shared_ptr<std::string> str = std::make_shared<std::string>(pThis->headers.get_response());
                    asio::async_write(pThis->socket, boost::asio::buffer(str->c_str(), str->length()), [pThis, str](const error_code& e, std::size_t s)
                    {
                        std::cout << "done" << std::endl;
                    });
                }
            }
            else
            {
                pThis->read_next_line(pThis);
            }
        });
    }

    // Request line
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
            //std::cout << "done" << std::endl;
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

void accept_and_run(ip::tcp::acceptor& acceptor, io_service& io_service, std::vector<std::thread>& Pool)
{
    // Make new session instance 
    std::shared_ptr<session> sesh = std::make_shared<session>(io_service);
    // Start listening
    acceptor.async_accept(sesh->socket, [sesh, &acceptor, &io_service, &Pool](const error_code& accept_error)
    {
        // Continue listening after accepting
        accept_and_run(acceptor, io_service, Pool);

        if(!accept_error)
        {
            //std::cout << Pool.size() << std::endl;
            //std::cout << std::thread::hardware_concurrency();
            
            /*
            if(Pool.size() == 1){
                if(Pool.back().joinable()) {
                    Pool.back().join();
                }
                Pool.pop_back();
            }
            */
            std::thread thread{[&sesh](){session::interact(sesh);}};
            //Pool.push_back(std::move(thread));
            thread.join();
            //session::interact(sesh);
        }
    });
}

int main(int argc, const char * argv[])
{
    io_service io_service;
    std::vector<std::thread> Pool;
    // Initialize endpoint on port 8080
    ip::tcp::endpoint endpoint{ip::tcp::v4(), 8080};
    ip::tcp::acceptor acceptor{io_service, endpoint};

    acceptor.listen();
    accept_and_run(acceptor, io_service, Pool);

    io_service.run();
    for (auto& t : Pool) t.join();
    return 0;
}
