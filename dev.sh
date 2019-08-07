#!/bin/sh

tmux new-session -d -s "bonsai-assessment" -n "git"
tmux send-keys 'while true; do clear; git log --all --oneline --remotes --branches --decorate --graph --color | head -n `tput lines`; sleep 2; done' C-m
tmux split-window -h

tmux new-window -t "bonsai-assessment" -n "client"
tmux send-keys 'clear; npm run test:watch' C-m
tmux split-window -h
tmux send-keys 'clear; npm run dev' C-m
tmux split-window -v -p 50
tmux send-keys 'clear; npm run format:watch' C-m
tmux split-window -v
tmux send-keys 'clear; npm run lint:watch' C-m

tmux select-window -t "bonsai-assessment:1"

tmux attach -t "bonsai-assessment"