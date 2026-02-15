# Glassmic Website Deployment Guide

Your website is ready locally! Follow these steps to host it on GitHub tailored for your custom domain `glassmicindia.com`.

## 1. Create a GitHub Repository
1. Go to [GitHub.com/new](https://github.com/new).
2. Name it `glassmic-website`.
3. Keep it **Public** (required for free GitHub Pages).
4. Click **Create repository**.

## 2. Push Your Code
Open your terminal in this folder and run:
```bash
git add .
git commit -m "Initial commit of Glassmic website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/glassmic-website.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username)*

## 3. Configure Domain
1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment**, ensure Source is set to **Deploy from a branch**.
3. Set Branch to **main**.
4. Scroll down to **Custom domain** and enter:
   `glassmicindia.com`
5. Click **Save**.
6. Check **Enforce HTTPS**.

## 4. DNS Settings (GoDaddy/Namecheap/etc.)
Login to where you bought your domain and add these records:
- **A Record**: `@` points to `185.199.108.153`
- **A Record**: `@` points to `185.199.109.153`
- **A Record**: `@` points to `185.199.110.153`
- **A Record**: `@` points to `185.199.111.153`
- **CNAME Record**: `www` points to `YOUR_USERNAME.github.io`

---

## Updating Content
- **Images**: Add new images to `assets/collections/[collection_name]`.
- **Regenerate Site**: Run `python3 regenerate_custom_banners.py` to update the HTML galleries automatically.
