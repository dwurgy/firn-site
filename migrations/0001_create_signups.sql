-- The sign-up list. Only the email address and the day it was added.
CREATE TABLE IF NOT EXISTS signups (
  email TEXT PRIMARY KEY,
  signed_up_on TEXT NOT NULL  -- YYYY-MM-DD
);

CREATE INDEX IF NOT EXISTS signups_by_day ON signups (signed_up_on);
