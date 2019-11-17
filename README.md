### Pre-Requirements

- Fork this github repository into your account (You will find a "fork" icon on the top right corner)
- Clone the forked repository that exists in **your github account** into your local machine

The directory structure needs to be as follows (both projects need to be cloned in the same parent directory):

```bash
drwxr-xr-x - user  7 Jun 17:56 pact-workshop-consumer-js
drwxr-xr-x - user  7 Jun 18:01 pact-workshop-provider-js
```

### Requirements

- Nodejs v12.4+
- Yarn

### Provider Step 0 (Setup)

#### NodeJs

Check your nodejs version with `node --version`

If you need to install node v12.4.0 or greater follow the instructions on [nvm](https://github.com/nvm-sh/nvm)

If you need to install yarn `npm install -g yarn`

### Install dependencies

- Navigate to the `pact-workshop-provider-js` directory and execute `yarn`

### Run the tests

- Execute `yarn test`

Get familiarised with the code

![System diagram](resources/system-diagram.png "System diagram")

There are two microservices in this system. A `consumer` and a `provider` (this repository).

The "provider" is a PaymentService that validates if a credit card number is valid in the context of that system.

The "consumer" only makes requests to PaymentService to verify payment methods.

Navigate to the directory in where you checked out `pact-workshop-consumer-js`, run `git checkout consumer-step1` and
follow the instructions in the Consumers' readme file
