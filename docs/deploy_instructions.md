# GCP CI/CD Setup Instructions

These instructions will help you connect this GitHub repository to Google Cloud Build so your `index.html` file is automatically deployed to your storage bucket every time you push code.

## Prerequisites
1. You have created a Google Cloud Project in the GCP Console.
2. You have created a Cloud Storage Bucket set to public access (e.g., `gs://www.my-expense-tracker.com`).
3. You have pushed this code to a repository on GitHub.

## Step 1: Update `cloudbuild.yaml`
1. Open the `cloudbuild.yaml` file in this directory.
2. Change the bucket name from `gs://your-bucket-name` to your actual bucket name.
3. Save the file and push it to GitHub.

## Step 2: Grant Permissions to Cloud Build
Cloud Build needs permission to write to your storage bucket.
1. Open the **Google Cloud Console**.
2. Go to **Cloud Build > Settings**.
3. Under the Service Account permissions structure, ensure the **Cloud Storage Developer** role is enabled (or **Storage Object Admin** depending on your exact configuration).

## Step 3: Link GitHub to Cloud Build
1. In the GCP Console, navigate to **Cloud Build > Repositories**.
2. Click **Connect Repository**.
3. Select **GitHub** as your source and follow the authentication flow to authorize Google Cloud.
4. Select your Expense Tracker repository from the list and connect it.

## Step 4: Create the Build Trigger
1. Navigate to **Cloud Build > Triggers**.
2. Click **Create Trigger**.
3. **Name**: `deploy-expense-tracker-to-bucket`
4. **Event**: **Push to a branch**
5. **Source**: Select the Repository you just connected, and set the Branch to `^main$` (or whatever your default branch is).
6. **Configuration**: Choose **Cloud Build configuration file (yaml or json)**.
7. **Location**: Leave it as `/cloudbuild.yaml`.
8. Click **Create**.

## Step 5: Test the Pipeline
1. Make a small visual change to your `index.html` or `style.css` file locally.
2. Commit your change: `git commit -am "test CI/CD deployment"`
3. Push your change: `git push origin main`
4. Go to **Cloud Build > History** in the GCP Console. You should see a new build running automatically. Once it turns green, your live website will be updated!
