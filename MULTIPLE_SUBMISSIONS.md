# Multiple Submissions Support

## ✅ System Design

The survey system is **fully designed to accept answers from multiple people**. Here's how it works:

### Database Schema

1. **Response Table**
   - Each submission creates a **new Response record** with a unique ID
   - No unique constraints prevent multiple submissions
   - Multiple people can submit to the same questionnaire

2. **Answer Table**
   - Each answer is linked to a specific Response ID
   - Answers from different people are stored separately
   - No conflicts between submissions

### How It Works

```
Person 1 submits → Creates Response #1 → Creates Answers linked to Response #1
Person 2 submits → Creates Response #2 → Creates Answers linked to Response #2
Person 3 submits → Creates Response #3 → Creates Answers linked to Response #3
...and so on
```

### Key Features

✅ **No Limits**: Unlimited number of people can submit  
✅ **Separate Records**: Each submission is stored independently  
✅ **No Conflicts**: Multiple concurrent submissions are handled safely  
✅ **API Fallback**: Works even if direct database connection fails  

### Submission Flow

1. User fills out survey form
2. Form validates required questions
3. `submitSurvey()` function:
   - Creates a new Response record
   - Creates Answer records linked to that Response
   - Returns success with Response ID
4. User sees thank-you page
5. Next person can submit (no blocking)

### Viewing Responses

Admins can view all responses:
- Go to `/admin/questionnaires/[id]/responses`
- See all submissions for a questionnaire
- Each response shows:
  - Submission timestamp
  - Language used
  - All answers submitted

### Testing Multiple Submissions

1. Fill out survey: http://localhost:3000/survey/staff-questionnaire?lang=en
2. Submit form
3. Open same URL in new browser/incognito
4. Fill out again with different answers
5. Submit again
6. Both submissions will be saved separately

### Technical Details

- **Response ID**: Auto-generated unique ID (CUID format)
- **Concurrency**: Database handles concurrent inserts safely
- **Validation**: Each submission is validated independently
- **No Duplicate Prevention**: System allows same person to submit multiple times (if needed)

---

**The system is ready to accept unlimited submissions from multiple people!** 🎉

