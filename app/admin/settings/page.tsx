export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";

async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  return (
    settings || {
      companyName: "Pop Events",
      tagline: "Bringing fresh ideas and exciting new events to Kuwait - designed for everyone to enjoy as a family day out.",
      aboutText: "",
      email: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
      twitter: "",
      address: "",
      mapEmbedUrl: "",
      smtpHost: "",
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: "",
      smtpPass: "",
      smtpFrom: "",
      notificationEmail: "",
    }
  );
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  async function updateSettings(formData: FormData) {
    "use server";

    const data: Record<string, unknown> = {
      companyName: formData.get("companyName") as string,
      tagline: formData.get("tagline") as string,
      aboutText: formData.get("aboutText") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      instagram: formData.get("instagram") as string,
      tiktok: formData.get("tiktok") as string,
      twitter: formData.get("twitter") as string,
      address: formData.get("address") as string,
      mapEmbedUrl: formData.get("mapEmbedUrl") as string,
      // Email / SMTP
      smtpHost: (formData.get("smtpHost") as string) || null,
      smtpPort: parseInt((formData.get("smtpPort") as string) || "465", 10),
      smtpSecure: formData.get("smtpSecure") === "on",
      smtpUser: (formData.get("smtpUser") as string) || null,
      smtpFrom: (formData.get("smtpFrom") as string) || null,
      notificationEmail: (formData.get("notificationEmail") as string) || null,
    };

    // Only overwrite the SMTP password when a new value is typed — a blank
    // field means "keep the existing password" (we never echo it back).
    const newSmtpPass = (formData.get("smtpPass") as string)?.trim();
    if (newSmtpPass) {
      data.smtpPass = newSmtpPass;
    }

    await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-600">Manage your site information and preferences</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">General</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              name="companyName"
              defaultValue={settings.companyName || ""}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              name="tagline"
              defaultValue={settings.tagline || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Text
            </label>
            <textarea
              name="aboutText"
              defaultValue={settings.aboutText || ""}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={settings.email || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={settings.phone || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                name="whatsapp"
                defaultValue={settings.whatsapp || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              defaultValue={settings.address || ""}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Map Embed URL
            </label>
            <input
              name="mapEmbedUrl"
              defaultValue={settings.mapEmbedUrl || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                name="instagram"
                defaultValue={settings.instagram || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <input
                name="tiktok"
                defaultValue={settings.tiktok || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter/X
              </label>
              <input
                name="twitter"
                defaultValue={settings.twitter || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email Notifications (SMTP) */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              SMTP settings used to send vendor-application and contact-form notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Recipient
              </label>
              <input
                name="notificationEmail"
                type="email"
                defaultValue={settings.notificationEmail || ""}
                placeholder="admin@popeventskuwait.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Where new applications & messages are sent.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input
                name="smtpHost"
                defaultValue={settings.smtpHost || ""}
                placeholder="smtp.hostinger.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                <input
                  name="smtpPort"
                  type="number"
                  defaultValue={settings.smtpPort ?? 465}
                  placeholder="465"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    name="smtpSecure"
                    type="checkbox"
                    defaultChecked={settings.smtpSecure ?? true}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Use TLS/SSL
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
              <input
                name="smtpUser"
                defaultValue={settings.smtpUser || ""}
                placeholder="you@yourdomain.com"
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
              <input
                name="smtpPass"
                type="password"
                autoComplete="new-password"
                placeholder={settings.smtpPass ? "•••••••• (leave blank to keep)" : "Enter password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Stored securely; never shown after saving.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Address</label>
              <input
                name="smtpFrom"
                defaultValue={settings.smtpFrom || ""}
                placeholder="noreply@popeventskuwait.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Falls back to the SMTP username if left blank.</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
