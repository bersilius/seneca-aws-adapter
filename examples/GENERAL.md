### IAM

You will have to create a user. You will be guided through a few views to create the user and obtain the required credentials.

On the "Details" view where you set "User name" you will have to check the "Programmatic access" checkbox, to enable an access key ID and secret access key for your microservice (or script, etc.) to configure your seneca-aws-adapter plugin.

You can click "Next: Permissions".

On the "Permission" view there are three main choices. For the sake of this example it is enough to attach existing policy directly to the new 'user'. You do not have to mess with group or roles. Choose "Attach existing policies directly" option and use the filter box to find the required policy. Each service has a "Full Access" policy like "AmazonSNSFullAccess" or "AWSMarketplaceFullAccess". Type in 'sns' for example. Tick the checkbox for "AmazonSNSFullAccess".

You can click "Next: Review".

After you are done with the "Review" of the previous steps, you can click "Create user".

After the above steps on the "Complete" view you will have the option to save the new credentials, for example accessKeyId and secretAccessKey, which can be later used when defining options for the seneca-aws-adapter to initialize the plugin. Keep them at a safe place.
