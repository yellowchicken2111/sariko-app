#!/bin/bash

MODEL=$(cat .aider-model-name)
aider --model ollama_chat/$MODEL
aider -read CONVENTIONS.md