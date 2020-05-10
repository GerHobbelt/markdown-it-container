PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell support/getGlobalName.js package)
NPM_VERSION := $(shell support/getGlobalName.js version)

GLOBAL_NAME := $(shell support/getGlobalName.js global)

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJ := https://github.com//GerHobbelt/${NPM_PACKAGE}


build: lint browserify rollup test coverage todo 

lint:
	eslint .

lintfix:
	eslint --fix .

rollup:
	-mkdir dist
	# Rollup
	rollup -c

test:
	mocha

coverage:
	-rm -rf coverage
	cross-env NODE_ENV=test nyc mocha

report-coverage: lint coverage


publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm run pub

browserify:
	-rm -rf ./dist
	mkdir dist
	# Browserify
	( printf "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */\n\n" ; \
		browserify ./index.js -s ${GLOBAL_NAME} \
		) > dist/${NPM_PACKAGE}.js

minify: browserify
	# Minify
	terser dist/${NPM_PACKAGE}.js -b beautify=false,ascii_only=true -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/${NPM_PACKAGE}.min.js

todo:
	@echo ""
	@echo "TODO list"
	@echo "---------"
	@echo ""
	grep 'TODO' -n -r ./ --exclude-dir=node_modules --exclude-dir=unicode-homographs --exclude-dir=dist --exclude-dir=coverage --exclude=Makefile 2>/dev/null || test true

clean:
	-rm -rf ./coverage/
	-rm -rf ./dist/

superclean: clean
	-rm -rf ./node_modules/
	-rm -f ./package-lock.json

prep: superclean
	-ncu -a --packageFile=package.json
	-npm install


.PHONY: clean superclean prep publish lint fix test todo coverage report-coverage doc build browserify minify gh-doc rollup
.SILENT: help lint test todo
