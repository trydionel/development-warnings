# Development warnings
  
This [Aha! Develop](https://www.aha.io/develop/overview) extension inspects work records to identify development risks.

It provides these contributions:

* Warnings: A view contribution showing a list of development warnings impacting the record. Available for Releases, Epics, Features, and Requirements.
* Various settings: Select the warnings that are most relevant for the way you work.

## Demo

![demo](res/demo.png)

## Installing the extension

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

Install the Development warnings extension by clicking [here](https://secure.aha.io/settings/account/extensions/install?url=https://github.com/trydionel/development-warnings/releases/download/v0.1.1/jeff-at-aha.development-warnings-v0.1.1.gz).

## Working on the extension

Install [`aha-cli`](https://github.com/aha-app/aha-cli):

```sh
npm install -g aha-cli
```

Clone the repo:

```sh
git clone https://github.com/trydionel/development-warnings
```

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

Install the extension into Aha! and set up a watcher:

```sh
aha extension:install
aha extension:watch
```

Now, any change you make inside your working copy will automatically take effect in your Aha! account.

## Building

When you have finished working on your extension, package it into a `.gz` file so that others can install it:

```sh
aha extension:build
```

After building, you can upload the `.gz` file to a publicly accessible URL, such as a GitHub release, so that others can install it using that URL.

To learn more about developing Aha! Develop extensions, including the API reference, the full documentation is located here: [Aha! Develop Extension API](https://www.aha.io/support/develop/extensions)
