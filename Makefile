.PHONY: server
# Commands for Chat Server

send:
	curl -d `cat server/test/fixtures/chat1.txt` http://localhost:8000/comet

send2:
	curl -d `cat server/test/fixtures/chat2.txt` http://localhost:8000/comet

get:
	curl http://localhost:8000/comet

server:
	yarn server
