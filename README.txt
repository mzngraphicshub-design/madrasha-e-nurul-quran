MADRASA NURUL QURAN — CONSOLIDATED HTML PACKAGE

This package contains the HTML/SQL files supplied in the conversation, consolidated under their deployment filenames. The original visual design has been retained. No GitHub repository files were changed.

A confirmed redirect issue was corrected in dashboard.html: a teacher authenticated through verify_teacher_login RPC is no longer redirected to the nonexistent admin.html merely because there is no Supabase Auth session; admin session expiry returns to login.html.

Included HTML files: login.html, login-teacher.html, dashboard.html, students.html, students-hub.html, donations-hub.html, accounts-hub.html, settings-hub.html, online-admission.html, online-admission-public.html, daily-reading.html.
Included SQL: daily-reading-supabase.sql.

Validation performed: all inline JavaScript blocks in the included HTML files pass Node.js syntax checking. This does NOT prove live Supabase behavior.

Important deployment note: these are the files actually supplied. Several sidebar/menu links in dashboard and hub pages point to other modules (for example attendance-students.html, teachers.html, fees.html, reports.html, sms.html, and others) that were not among the supplied files. Those modules must also exist in the deployed site for those links to work. The login pages also reference img/logo.png and index.html; those assets/pages were not included in the supplied files. Do not delete existing repository modules when uploading this package.

Supabase note: Teacher login depends on the existing public.verify_teacher_login RPC. Student daily reading depends on the included SQL and the assumed public.students.student_id and phone columns. Existing RLS policies, other RPCs, table schemas, and Supabase Auth settings have not been live-tested from this package.
