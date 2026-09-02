/*  Admin screens were the first users of the toast stack; it now lives in
    components/common/Toast.jsx and serves the member-facing pages too. These
    aliases keep the admin call sites reading in their own vocabulary. */
export { ToastProvider as AdminToastProvider, useToast as useAdminToast } from "../common/Toast";
