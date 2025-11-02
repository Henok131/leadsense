/**
 * i18n Configuration
 * Internationalization setup with react-i18next
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        subtitle: 'Manage your preferences, theme, language, and API keys',
        theme: 'Theme',
        language: 'Language',
        timezone: 'Timezone',
        notifications: 'Notifications',
        apiKeys: 'API Keys',
        billing: 'Billing',
        security: 'Security',
        ai: 'AI Preferences',
        email: 'Email & Notifications',
        data: 'Data Portability',
        team: 'Team',
        save: 'Save Settings',
        saved: 'Settings saved successfully!',
      },
    },
  },
  de: {
    translation: {
      settings: {
        title: 'Einstellungen',
        subtitle: 'Verwalten Sie Ihre Präferenzen, Theme, Sprache und API-Schlüssel',
        theme: 'Theme',
        language: 'Sprache',
        timezone: 'Zeitzone',
        notifications: 'Benachrichtigungen',
        apiKeys: 'API-Schlüssel',
        billing: 'Abrechnung',
        security: 'Sicherheit',
        ai: 'KI-Einstellungen',
        email: 'E-Mail & Benachrichtigungen',
        data: 'Datenportabilität',
        team: 'Team',
        save: 'Einstellungen speichern',
        saved: 'Einstellungen erfolgreich gespeichert!',
      },
    },
  },
  fr: {
    translation: {
      settings: {
        title: 'Paramètres',
        subtitle: 'Gérez vos préférences, thème, langue et clés API',
        theme: 'Thème',
        language: 'Langue',
        timezone: 'Fuseau horaire',
        notifications: 'Notifications',
        apiKeys: 'Clés API',
        billing: 'Facturation',
        security: 'Sécurité',
        ai: 'Préférences IA',
        email: 'E-mail et notifications',
        data: 'Portabilité des données',
        team: 'Équipe',
        save: 'Enregistrer les paramètres',
        saved: 'Paramètres enregistrés avec succès !',
      },
    },
  },
  es: {
    translation: {
      settings: {
        title: 'Configuración',
        subtitle: 'Administre sus preferencias, tema, idioma y claves API',
        theme: 'Tema',
        language: 'Idioma',
        timezone: 'Zona horaria',
        notifications: 'Notificaciones',
        apiKeys: 'Claves API',
        billing: 'Facturación',
        security: 'Seguridad',
        ai: 'Preferencias de IA',
        email: 'Correo electrónico y notificaciones',
        data: 'Portabilidad de datos',
        team: 'Equipo',
        save: 'Guardar configuración',
        saved: '¡Configuración guardada exitosamente!',
      },
    },
  },
  pt: {
    translation: {
      settings: {
        title: 'Configurações',
        subtitle: 'Gerencie suas preferências, tema, idioma e chaves API',
        theme: 'Tema',
        language: 'Idioma',
        timezone: 'Fuso horário',
        notifications: 'Notificações',
        apiKeys: 'Chaves API',
        billing: 'Faturamento',
        security: 'Segurança',
        ai: 'Preferências de IA',
        email: 'E-mail e notificações',
        data: 'Portabilidade de dados',
        team: 'Equipe',
        save: 'Salvar configurações',
        saved: 'Configurações salvas com sucesso!',
      },
    },
  },
  ar: {
    translation: {
      settings: {
        title: 'الإعدادات',
        subtitle: 'إدارة تفضيلاتك وسماتك ولغتك ومفاتيح API',
        theme: 'المظهر',
        language: 'اللغة',
        timezone: 'المنطقة الزمنية',
        notifications: 'الإشعارات',
        apiKeys: 'مفاتيح API',
        billing: 'الفوترة',
        security: 'الأمان',
        ai: 'تفضيلات الذكاء الاصطناعي',
        email: 'البريد الإلكتروني والإشعارات',
        data: 'قابلية نقل البيانات',
        team: 'الفريق',
        save: 'حفظ الإعدادات',
        saved: 'تم حفظ الإعدادات بنجاح!',
      },
    },
  },
  zh: {
    translation: {
      settings: {
        title: '设置',
        subtitle: '管理您的偏好、主题、语言和 API 密钥',
        theme: '主题',
        language: '语言',
        timezone: '时区',
        notifications: '通知',
        apiKeys: 'API 密钥',
        billing: '计费',
        security: '安全',
        ai: 'AI 偏好',
        email: '电子邮件和通知',
        data: '数据可移植性',
        team: '团队',
        save: '保存设置',
        saved: '设置保存成功！',
      },
    },
  },
  ja: {
    translation: {
      settings: {
        title: '設定',
        subtitle: '設定、テーマ、言語、APIキーを管理',
        theme: 'テーマ',
        language: '言語',
        timezone: 'タイムゾーン',
        notifications: '通知',
        apiKeys: 'APIキー',
        billing: '請求',
        security: 'セキュリティ',
        ai: 'AI設定',
        email: 'メールと通知',
        data: 'データの可搬性',
        team: 'チーム',
        save: '設定を保存',
        saved: '設定が正常に保存されました！',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || navigator.language.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

