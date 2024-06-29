# Wishlist

# Setup

This project uses Appwrite as a backend. This is because it's a decent backend that I've wanted to use properly for a while and I didn't want to spend an eternity setting one up myself for this project.
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

Then, move the created `output.env` file to `.env`.

You can also set the below options in the `.env` file:

- `VITE_LOGIN_METHODS`: github,password
    - Currently only supports the above options. Both need to be set up within Appwrite.
- `VITE_UMAMI_URL`: https://analytics.example.com/script.js
- `VITE_UMAMI_ID`: f79676da-d2c5-49dd-a35b-f829764b44c5
- `VITE_UMAMI_DOMAINS`: example.com

### Appwrite App config

Then, create a "Web" app within Appwrite, to your liking.

It should then all be set up and ready to go.

Just build it and deploy it to wherever you want. It doesn't need any backup setup (other than Appwrite), but you will need SPA support for vue-router.


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


## Other notes

A fair bit of this project uses British English (Namely, the spelling of fulfillment). If this offends you, too bad. At least the use of "color" is consistent.