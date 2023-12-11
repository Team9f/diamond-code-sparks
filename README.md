# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Part II: Updated Readme for Project 3 (Assessments) work
### Project features implemented:
* Tab on teacher's classrooom page for assessments
  ![Alt text](https://drive.google.com/uc?id=1rvbJX8pnF9vpTIjuz6Eb_kjKjCwzJTWn)
* The UI for the assessments tab which includes a button to make an assessment, a table to view and manage the created assessments, and a table of students and a button to view the assessments they have completed including the answer choices made
* The table to view and manage assessments includes an open button that will open a preview of the assessment
  ![Alt text](https://drive.google.com/uc?id=1edKYAERzudR50MfhIOg9I90WPLkRiiZE)
* The table to view and manage assesments includes a button to delete the assessment and toggle to change whether the assessment is visible to students or not
![Alt text](https://drive.google.com/uc?id=1JJxolMiAD5gXBaqRMVQhC1-_qg2brn4b)
* The create assessments button opens a form where teachers can add multiple choice questions or free response questions, add the answer choices, and preview the assessment

  ![Alt text](https://drive.google.com/uc?id=1aI_GJmjBEYii3Sp1YlX05jt_i_HQMQCT)
* The table to view student's assessments includes a button that will open a page with the list of assessments the student has taken. Then there is a button to view the assessment and the student's answers
![Alt text](https://drive.google.com/uc?id=1VwugBOscEnt5lkfQ-JFAZClBAFhvHJ2W)
* The student side includes a new tab for assessments
  ![Alt text](https://drive.google.com/uc?id=1vzymsOnaCFbfOi-FI9HOTYj0d0y3OlKu)
* A table was created that includes all the assessments that are visible for that class
* Each assessment is a button that opens up to a new form that we created. The form displays the assesments and allows the student to submit their answers
![Alt text](https://drive.google.com/uc?id=1_-2HiGZW_vReoh0ELCsbo84pJEda2Jq0)

### Running the project
To run the project locally, you can follow the same procedures as the original codebase from which this repo was forked from. For the backend use docker-compose up and use yarn start in the client directory. 

### Database and server connections
We use the strapi backend to store the data. Updates need to be done on the strapi admin pages for the following roles under Users & Permissions Plugin:
* Student
  * Select all for Assessments and Student-Assessments
* Classroom Manager
  * Select all for Assessments and Student-Assessments

### Database and Strapi dump files
All changes to the Strapi backend are stored in their respective folder under server/api. 

### Outstanding work
* Work on adding a due date functionality for assessments
* Number of trials for assessments
* Time stamp for assessments
* Fixing the UI for the student's assessments form. The cards for each question are too small and some of questions go outside of the card.
* Properly storing the deleted assesments so that when viewing a completed student assessment form we can still retrieve the questions and asnwers from the deleted assessment

### Built upon
* Ant design for the React components used to make tables,buttons, modals, and more.
* Bootstrap to create styling of our forms


## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`

#### Running

`casmm-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit
