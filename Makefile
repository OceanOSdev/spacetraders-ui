# Makefile for SpaceTraders UI development
SHELL := /bin/bash

# Default target
.DEFAULT_GOAL := help

NPM := npm
NPX := npx

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install dependencies
	$(NPM) install

.PHONY: format
format: ## Format code
	$(NPM) run format

.PHONY: dev
dev: ## Run development server
	$(NPM) run dev

.PHONY: build
build: ## Build production bundle
	$(NPM) run build

.PHONY: preview
preview: ## Preview production build
	$(NPM) run preview

.PHONY: typecheck
typecheck: ## Run TypeScript type checker
	$(NPX) tsc --noEmit

.PHONY: typewatch
typewatch: ## Continuous type checking
	$(NPX) tsc --noEmit --watch

.PHONY: lint
lint: ## Lint (if ESLint is installed later)
	$(NPX) eslint src

.PHONY: clean
clean: ## Remove build artifacts
	rm -rf dist

.PHONY: reset
reset: ## Remove everything and reinstall dependencies
	rm -rf node_modules
	rm -f package-lock.json
	$(NPM) install
