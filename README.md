# smarthome

Add Request Sync and Report State

The Request Sync feature allows a cloud integration to send a request to the Home Graph to send a new SYNC request. The Report State feature allows a cloud integration to proactively provide the current state of devices to the Home Graph without a QUERY request. These are done securely through JWT (JSON web tokens).

    1. Navigate to the Google Cloud Console API Manager for your project id.
    2. Enable the HomeGraph API.
    3. Navigate to the Google Cloud Console API & Services page
    4. Select Create Credentials and create a Service account key
        Create a new Service account
        Use the role Service Account > Service Account Token Creator
    5. Create the account and download a JSON file. Save this as src/smart-home-key.json.

Set up Account linking

    1. On a device with the Google Assistant logged into the same account used to create the project in the Actions Console, enter your Assistant settings.
    2. Click Home Control.
    3. Click the '+' sign to add a device.
    4. Find your app in the list of providers.
    5. Log in to your service.
    6. Start using the Google Assistant in the Actions Console to control your devices. Try saying 'turn my lights on'.
