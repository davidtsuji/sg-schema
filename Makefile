build:
	@make install
	@component build --dev

install:
	@component install --dev > /dev/null

.PHONY: build install