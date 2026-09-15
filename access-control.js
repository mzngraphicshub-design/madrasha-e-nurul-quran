/* =========================================================
   MADRASHA-E NURUL QURAN
   Teacher Page Access Control
   ========================================================= */

const MNQ_SUPABASE_URL =
  "https://qavublwhqiqsgpcmfyft.supabase.co";

const MNQ_SUPABASE_KEY =
  "sb_publishable_AKYAjFdlgz7r2IyjKk9GWA_-QDuDPKQ";

const MNQ_PAGE_MAP = {

  "students.html": "students",
  "teachers.html": "teachers",
  "employees.html": "employees",
  "members.html": "members",

  "classes.html": "classes",
  "subjects.html": "subjects",
  "sessions.html": "sessions",

  "results.html": "results",
  "fees.html": "fees",
  "salary.html": "salary",
  "income.html": "income",
  "expenses.html": "expenses",

  "attendance.html": "attendance-students",
  "student-attendance.html": "attendance-students",
  "teacher-attendance.html": "attendance-teachers",
  "employee-attendance.html": "attendance-employees",

  "id-card.html": "id-card",
  "admit-card.html": "admit-card",

  "sms.html": "sms",
  "notices.html": "notices",
  "gallery.html": "gallery",
  "videos.html": "videos",

  "reports.html": "reports",
  "complaints.html": "complaints",

  "online-admission.html": "online-admission",
  "certificates.html": "certificates",

  "nazera.html": "nazera",
  "hifz.html": "hifz",
  "quran.html": "quran",
  "dua.html": "dua",
  "behavior.html": "behavior",

  "parent-report.html": "parent-report"
};


function mnqGetCurrentFile() {

  let path = window.location.pathname.split("/").pop();

  if (!path || path === "") {
    path = "index.html";
  }

  return path.toLowerCase();
}


async function mnqGetClient() {

  if (window.supabase && window.supabase.createClient) {

    return window.supabase.createClient(
      MNQ_SUPABASE_URL,
      MNQ_SUPABASE_KEY
    );

  }

  return null;
}


async function mnqCheckAccess() {

  const currentFile = mnqGetCurrentFile();

  /*
    Public pages
  */
  const publicPages = [
    "",
    "index.html",
    "login.html",
    "admission.html",
    "student-login.html"
  ];

  if (publicPages.includes(currentFile)) {
    return true;
  }


  const db = await mnqGetClient();

  if (!db) {
    console.error("Supabase client unavailable.");
    return false;
  }


  /*
    Check logged-in user
  */
  const {
    data: sessionData,
    error: sessionError
  } = await db.auth.getSession();


  if (
    sessionError ||
    !sessionData ||
    !sessionData.session ||
    !sessionData.session.user
  ) {

    window.location.replace("login.html");
    return false;
  }


  const user = sessionData.session.user;


  /*
    Get role
  */
  const role =
    user.app_metadata?.role ||
    user.user_metadata?.role ||
    sessionStorage.getItem("madrasa_login_role") ||
    "";


  /*
    Admin = everything
  */
  if (role.toLowerCase() === "admin") {
    return true;
  }


  /*
    Settings is ADMIN ONLY
  */
  if (currentFile === "settings.html") {

    alert("এই পেজটি শুধুমাত্র Admin-এর জন্য অনুমোদিত।");

    window.location.replace("dashboard.html");

    return false;
  }


  /*
    Dashboard itself is available
    for authenticated teachers.
  */
  if (currentFile === "dashboard.html") {
    return true;
  }


  /*
    Find page permission
  */
  const pageKey = MNQ_PAGE_MAP[currentFile];


  /*
    Unknown page:
    Don't accidentally expose management pages.
  */
  if (!pageKey) {

    return true;
  }


  /*
    Load teacher permission
  */
  const email = user.email;

  if (!email) {

    alert("Teacher account email পাওয়া যায়নি।");

    window.location.replace("login.html");

    return false;
  }


  const {
    data,
    error
  } = await db
    .from("teacher_permissions")
    .select("pages")
    .eq("email", email.toLowerCase())
    .maybeSingle();


  if (error) {

    console.error("Permission loading error:", error);

    alert("Permission যাচাই করা যাচ্ছে না।");

    window.location.replace("dashboard.html");

    return false;
  }


  const pages = Array.isArray(data?.pages)
    ? data.pages
    : [];


  /*
    Check permission
  */
  if (!pages.includes(pageKey)) {

    alert("এই পেজটি আপনার Teacher Account-এর জন্য অনুমোদিত নয়।");

    window.location.replace("dashboard.html");

    return false;
  }


  return true;
}


/*
   Start guard
*/
document.addEventListener("DOMContentLoaded", async () => {

  try {

    await mnqCheckAccess();

  } catch (error) {

    console.error("Access Control Error:", error);

    window.location.replace("dashboard.html");

  }

});
