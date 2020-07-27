all: server

server: asio_http.cpp
	g++ asio_http.cpp -I /usr/local/Cellar/boost/1.54.0/include -std=c++11 -lboost_system -lstdc++fs -o server

clean:
	rm server
