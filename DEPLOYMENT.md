# Cloudflare Pages Deployment Guide

This guide will help you deploy the **Card Game Antigravity** to Cloudflare Pages.

## Option 1: Using the Cloudflare Dashboard (Recommended)

This is the easiest way to keep your site updated automatically whenever you push code to GitHub/GitLab bitbucket.

1.  **Push your code** to a GitHub repository (if you haven't already).
2.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4.  Select your repository.
5.  In the **Build settings** section, use the following:
    *   **Framework preset**: `Vite` (or `None`)
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
    *   **Root directory**: `/` (unless you move the project into a subfolder)
6.  Click **Save and Deploy**.

## Option 2: Using the CLI (Manual Deployment)

If you prefer to deploy manually from your terminal:

1.  **Install Wrangler** (the Cloudflare CLI):
    ```bash
    npm install -g wrangler
    ```
2.  **Login** to your Cloudflare account:
    ```bash
    wrangler login
    ```
3.  **Build the project** locally:
    ```bash
    npm run build
    ```
4.  **Deploy** to Cloudflare Pages:
    ```bash
    wrangler pages deploy dist
    ```

## Local Build Issues

If you encounter an error like `npm.ps1 cannot be loaded because running scripts is disabled` when running `npm run build` on Windows:

1.  Open PowerShell as Administrator.
2.  Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3.  Try running `npm run build` again.

Alternatively, you can run the build using `node` directly:
```bash
node_modules/.bin/vite build
```
