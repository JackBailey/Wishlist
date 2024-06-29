# wishlist

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## TODO

- [ ] Appwrite setup
    - [ ] Appwrite perms
## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

# Setup

This project uses Appwrite as a backend. This is because it's a decent backend that I've wanted to use and I didn't want to spend an eternity setting one up myself for this project.
<br><br>
[![wakatime](https://wakatime.com/badge/user/aab4eaf1-e07e-49cd-89d9-234064f91994/project/3ea91771-baff-4b33-b5b5-bb87aca0a66d.svg)](https://wakatime.com/badge/user/aab4eaf1-e07e-49cd-89d9-234064f91994/project/3ea91771-baff-4b33-b5b5-bb87aca0a66d)

## Appwrite

### Installation

Get Appwrite running. You can do this by following the instructions on the [Appwrite website](https://appwrite.io/docs/installation).

### Setup

Install dependencies for this project:

```sh
pnpm install
```

Create a new project within Appwrite, and create a new API key. Subsitute the values in the below command with your API key and Project ID. Replace the endpoint if using your own instance.

```sh
pnpm run setup --key=YOUR-API-KEY --project=YOUR-PROJECT-ID --endpoint=https://cloud.appwrite.io/v1
```

This will then go through and set up the collections you need. You then need to set up the authentication settings depending on your preferences.




## Other notes

A fair bit of this project uses British English. I'm sorry if this offends you, but I'm British and I'm not going to change it. (Namely, the spelling of fulfillment).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
