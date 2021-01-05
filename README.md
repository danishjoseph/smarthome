# Smarthome
Fully functioning Smart Home API's that works with Actions on Google. This can be used with a Actions Console project to create an Action interface to your IoT devices. Every device data is stored in a local json file thus by isolating the entire project from google firebase as well. This documentation includes everything you need to get started, however the oAuth authentication now left done. will be updated soon.

## Setup Instructions

### Steps for installing mosquitto broker. 
- For windows users download the exe file from this [link](https://mosquitto.org/download/) finish the installation procedure. pretty much straight forward. 
- For Linux users you could install using the following commands
    - sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
    - sudo apt-get update
    - sudo apt-get install mosquitto mosquitto-clients
    
### Steps for installing google actions webhook.

#### Create and set up project in Actions Console.
1. Use the Actions on Google Console to add a new project with a name of your choosing and click Create Project.
2. Select Home Control, then click Smart Home.
3. Navigate to the Google Cloud Console API Manager for your project id.
4. Enable the HomeGraph API.
5. Navigate to the Google Cloud Console API & Services page
6. Select Create Credentials and create a Service account key
   Create a new Service account
   Use the role Service Account > Service Account Token Creator
7.Create the account and download a JSON file. Save this as src/smart-home-key.json inside the cloned project.

#### Local Deplyoment
1. Clone the project
```sh
    git clone https://github.com/danishjoseph/smarthome.git
    cd smarthome
```
2. create a new file inside src/smart-home-key.json and copy the service account key.
3. Run the following commands:
```sh
npm install 
npm run start
```
copy the links in command line for updating in actions console.

#### Setup ESP Devices
1. Open up a new terminal and run the following command:
```sh
npm run add-device
```
2. Enter the deviceId(s) provided while flashing the code to the ESP. ESP flashing code link can be found [ here]()

#### Start testing
1. Navigate back to the Actions on Google Console.
2. From the top menu under Develop, click on Actions (left nav). Click on Add your first action and choose your app's language(s).
    - Enter the URL for fulfillment, and click Save.
3. On the left navigation menu under ADVANCED OPTIONS, click on Account Linking.
    - Under Client Information, enter the client ID and secret as:
      - Client Id: sampleClientId
      - Client Secret: sampleClientSecret
      - The Authorization URL: ngrok link from your cli.
      - The Token URL: ngrok link from your cli
   - Click Save.
   - On the top navigation menu, click Test to begin testing this app.


#### Set up Account linking
1. On a device with the Google Assistant logged into the same account used to create the project in the Actions Console, enter your Assistant settings.
2. Click Home Control.
3. Click the '+' sign to add a device.
4. Find your app in the list of providers.
5. Log in to your service.
6. Start using the Google Assistant in the Actions Console to control your devices. Try saying 'turn my lights on'.
