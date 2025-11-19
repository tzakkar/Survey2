# Clear Next.js Cache - Fix Missing Options Issue

Since the database shows the question has 5 options, but the form isn't displaying them, this is likely a **Next.js caching issue**.

## Steps to Fix:

1. **Stop your dev server** (Ctrl+C in the terminal running `npm run dev`)

2. **Clear the Next.js cache:**
   ```powershell
   # Delete .next folder
   Remove-Item -Recurse -Force .next
   ```

3. **Restart the dev server:**
   ```powershell
   npm run dev
   ```

4. **Hard refresh your browser:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Or `Cmd + Shift + R` (Mac)
   - This clears the browser cache

5. **Check the browser console** (F12 → Console):
   - Look for any warnings about missing options
   - The debug logs we added should show if options are being fetched

## If it still doesn't work:

The question ID in the database might be different from what the app is fetching. Check:

1. **Browser Console** - Look for the question ID in the warning message
2. **Compare with database** - Run this SQL:
   ```sql
   SELECT id, "order", "textEn" 
   FROM "Question" 
   WHERE "textEn" ILIKE '%meet all formal performance requirements%';
   ```

3. If IDs don't match, the question was recreated. You'll need to either:
   - Delete the old question and recreate it with options, OR
   - Update the options to point to the new question ID

