# James Stein — Personal Site

A static personal site positioning James Stein for **AI integrations, workflow automation, and custom applications**. Plain HTML, CSS, and a little JavaScript. There's no build step and nothing to install.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Landing page: headline, short pitch, "Start a project" button |
| `about.html` | About me, the three services, and a call to action |
| `blog.html` | Journal index (list of posts) |
| `posts/*.html` | Individual journal posts |
| `contact.html` | Standalone contact page with the form inline (shareable link) |
| `css/style.css` | All styling. Colors and fonts are variables at the top |
| `js/site.js` | Contact form (popup + inline), footer year, header effect |

## Contact form setup (Web3Forms) — TO DO

The contact form sends submissions to your inbox through [Web3Forms](https://web3forms.com), so **your email address never appears on the site**. Until it's set up, the form shows visitors a "The contact form isn't connected yet" message, and no message goes anywhere.

### Steps

1. Go to **https://web3forms.com** and click **Create your Access Key**.
2. Enter the email address where you want to **receive** messages. No account or password is needed.
3. Check that inbox for an email from Web3Forms that contains your **Access Key**, a long string like `a1b2c3d4-....`.
4. Open `js/site.js` and replace the placeholder on line 8:
   ```js
   var WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
   ```
   with your key:
   ```js
   var WEB3FORMS_ACCESS_KEY = "a1b2c3d4-....";
   ```
5. Save, open the site, click **Get in touch**, and send yourself a test message. You should see "Message sent." on the page, and the email should arrive within a minute. Check spam the first time.

### Good to know

- **The access key is safe to publish.** It can only send messages *to you*. It can't read anything or reveal your address.
- **Replying:** the visitor's email is set as the reply-to address, so hitting Reply in your inbox goes straight to them.
- **Free plan:** 250 submissions per month, which is plenty for a personal site.
- **Spam:** a hidden "honeypot" field catches most bots. If spam becomes a problem, Web3Forms supports adding hCaptcha from its dashboard.
- **Changing where messages go:** generate a new key with the new email and swap it into `js/site.js`.
- **What each email contains:** name, email, what they're interested in (AI integration / Workflow automation / Custom application / Not sure yet), budget (optional), their message, and which page they sent it from.
- **Form fields and wording** are in the `formMarkup()` function in `js/site.js`.

### Alternatives (if you ever switch)

- **Formspree** (formspree.io): similar, with a free tier of 50 submissions a month.
- **Netlify Forms**: built in if you host on Netlify. You'd add `data-netlify="true"` to the form and post to Netlify instead.

## Editing content

- **Bio:** `about.html` has a hidden `<!-- Bio goes here -->` comment where your background paragraph belongs.
- **Portrait:** add a photo at `images/portrait.jpg`, then in `about.html` replace the `<span aria-hidden="true">J</span>` inside `.portrait` with:
  ```html
  <img src="images/portrait.jpg" alt="Portrait of James Stein">
  ```
- **Availability badge:** the "Taking on new projects for early 2027" line is near the top of `index.html`.
- **Colors / fonts:** change the variables at the top of `css/style.css` (`--accent` is the terracotta highlight). Dark mode colors are in the block just below.

## Adding a journal post

1. Copy `posts/every-office-has-a-spreadsheet.html` to a new file, e.g. `posts/automating-invoices.html`.
2. Update the `<title>`, the meta description, the `<h1>`, the summary under it (`.post-dek`), the date and read time, and the body.
3. In `blog.html`, copy the existing `<li>...</li>` block, paste it **at the top** of the list, and update the link, date, title and summary.

## Previewing locally

Open `index.html` directly in a browser. For the most accurate preview, serve the folder over a local web server, because some browsers restrict pages opened from disk.

## Publishing

Any static host works. Upload the folder as-is:

- **Netlify**: drag and drop the folder at app.netlify.com/drop
- **Cloudflare Pages** or **GitHub Pages**: connect a repository containing these files

After it's live, point your custom domain at the host and send a test message through the contact form.
