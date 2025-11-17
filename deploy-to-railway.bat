@echo off  
echo =====================================  
echo MARKET INTELLIGENCE RAILWAY DEPLOYMENT  
echo =====================================  
echo.  
echo Step 1: Initializing Git...  
git init  
git add .  
git commit -m "Market Intelligence Dashboard - Ready for Railway"  
echo.  
echo Step 2: GitHub Setup Needed  
echo Please create a repo at: https://github.com/new  
echo Name it: market-intelligence-dashboard  
echo.  
set /p github_user="Enter your GitHub username: "  
echo.  
echo Step 3: Pushing to GitHub...  
git remote add origin https://github.com/%%github_user%%/market-intelligence-dashboard.git  
git branch -M main  
git push -u origin main  
echo.  
echo Step 4: Opening Railway...  
start https://railway.app  
echo.  
echo =====================================  
echo NEXT STEPS:  
echo 1. In Railway, click "Start a New Project"  
echo 2. Select "Deploy from GitHub repo"  
echo 3. Choose: market-intelligence-dashboard  
echo 4. Add PostgreSQL database  
echo 5. Set environment variables  
echo =====================================  
pause 
