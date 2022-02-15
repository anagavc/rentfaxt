
# Rentfaxt
`This is a dynamic NodeJS and Mongo DB based web application with a user and admin interfaces for a real estate listing firm, the goal of the application is to enable users/realtor signup and list their available real estate for interested prospective clients, there are different categories for real estate which include Rentals, Land Sales and Property Management.After listing the real estate with the relevant information,they are able to get the prospective clients to call them. The administrator of the web application has the ability to upload rentals as weel and alos delete rentals that do not meet the required standards. For each added property, a map is automatically generated for it using Mapbox's map api, SCSS is used as the css preprocessor thereby allowing for an easier management of the web application's css files,Cloudinary is used for management of image uploads and PassportJS for the authentication of users and adminstrators`
## Demo

`The link to the live website:`

https://serene-castle-56529.herokuapp.com/
## Features

- Admin & User Login system
- Mapbox API
- SASS CSS preprocessor
- Image upload to cloudinary
- Fully responsive on all devices
- Accept calls from would be clients
- Manage every single listed rental as an admin
- Abiliity to upload specific rentals such as landsales,rentals and brokerage deals



## Installation

Make sure you have node installed and then procced to execute this command in the terminal

```bash
  npm i
```
    
## Environment Variables

Create an account on mongodb.com and create a new cluster, then set the env value of:

```javascript
DB_URL = to the name of yout atlas database

```
Create an account on cloudinary and set all the values with the name cloudinary to the respective cloudinary value:
```javascript
CLOUDINARY_CLOUD_NAME = name_of_cloudinary_cloud
CLOUDINARY_KEY = cloudinary_key
CLOUDINARY_SECRET = cloudinary_secret_phrase
```
Create an account on Mapbox, then set the env value of:

```javascript
MAPBOX_TOKEN = to_your_MapBox_token

```
For management of the sessions, set an env variable

```javascript
SECRET = any_secret_key_of_your_choice

```


## Usage/Examples

`For real estate firms that allow verified users to also upload their own rentals`

## Screenshots
`The Hero Section`

![Hero Section](https://i2.paste.pics/G12EK.png)

`The Services Section`
![Gallery Section](https://i2.paste.pics/G12GN.png)

`The Registration Page`
![Admin Panel](https://i2.paste.pics/G12IQ.png)

## Contributing

Contributions are highly appreciated!

`Kindly send a pull request and I will review them with immediate effect`

