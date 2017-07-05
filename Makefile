VERSION = 1.5.0
CONTAINER_NAME = meuml_app_web
IMAGE_NAME = meuml/$(CONTAINER_NAME)

build_prod:
	docker build -t $(IMAGE_NAME):$(VERSION) --rm .

build_develop:
	docker build -t $(IMAGE_NAME):develop --rm .

push: build_prod
	git push --all
	git push --tags
	docker tag $(IMAGE_NAME):$(VERSION) docker.gorillascode.com/$(IMAGE_NAME):$(VERSION)
	docker tag $(IMAGE_NAME):$(VERSION) docker.gorillascode.com/$(IMAGE_NAME):latest
	docker push docker.gorillascode.com/$(IMAGE_NAME):$(VERSION)
	docker push docker.gorillascode.com/$(IMAGE_NAME):latest

push_develop: build_develop
	docker tag $(IMAGE_NAME):develop docker.gorillascode.com/$(IMAGE_NAME):develop
	docker push docker.gorillascode.com/$(IMAGE_NAME):develop
