"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Bell, RefreshCw, CheckCircle2, XCircle, Clock, Send, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/language-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function NotificationManagementForm() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTriggering, setIsTriggering] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    lastScan: null as string | null
  })

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/notifications/logs')
      const data = await response.json()
      if (data.success) {
        setLogs(data.logs)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch notification logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const triggerScan = async () => {
    setIsTriggering(true)
    try {
      const response = await fetch('/api/notifications/scan', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}`
        }
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: t('settings_status.success'),
          description: t('notifications_admin.logs.scanSuccess'),
        })
        fetchLogs()
      } else {
        toast({
          title: t('settings_status.error'),
          description: result.error || t('notifications_admin.logs.scanError'),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t('settings_status.error'),
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsTriggering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
          <CardHeader className="p-5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/5">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 tracking-tight">{t('notifications_admin.stats.total')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</div>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('notifications_admin.stats.totalDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
          <CardHeader className="p-5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/5">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 tracking-tight">{t('notifications_admin.stats.success')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.sent}</div>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('notifications_admin.stats.successDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
          <CardHeader className="p-5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/5">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 tracking-tight">{t('notifications_admin.stats.errors')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-black text-rose-600 tracking-tighter">{stats.failed}</div>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('notifications_admin.stats.errorsDesc')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
        <CardHeader className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/5 shrink-0">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight break-words">{t('notifications_admin.logs.title')}</CardTitle>
                <CardDescription className="text-slate-600 text-sm font-bold break-words">{t('notifications_admin.logs.description')}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={fetchLogs}
                disabled={isLoading}
                className="w-full sm:w-auto h-11 px-6 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white rounded-xl font-black shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCw className={cn("h-4 w-4 transition-transform group-hover:rotate-180 duration-500", isLoading && "animate-spin")} />
                {t('notifications_admin.logs.refresh')}
              </Button>
              <Button
                onClick={triggerScan}
                disabled={isTriggering}
                className="w-full sm:w-auto h-11 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                {isTriggering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
                {t('notifications_admin.logs.triggerScan')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-slate-900 mb-4" />
              <p className="text-sm font-black text-slate-900 animate-pulse tracking-tight">{t('notifications_admin.logs.loading')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="pl-6 py-4 text-[10px] font-black text-slate-900">{t('notifications_admin.logs.table.user')}</TableHead>
                    <TableHead className="py-4 text-[10px] font-black text-slate-900">{t('notifications_admin.logs.table.status')}</TableHead>
                    <TableHead className="py-4 text-[10px] font-black text-slate-900">{t('notifications_admin.logs.table.date')}</TableHead>
                    <TableHead className="pr-6 py-4 text-right text-[10px] font-black text-slate-900">{t('notifications_admin.logs.table.details')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                            <Mail className="h-6 w-6 text-slate-300" />
                          </div>
                          <p className="text-sm font-bold text-slate-500">{t('notifications_admin.logs.noLogs')}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-tight">
                              {log.user?.full_name || log.email}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">{log.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider shadow-sm transition-all",
                            log.status === 'sent' 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          )}>
                            {log.status === 'sent' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {log.status === 'sent' ? t('notifications_admin.logs.status.sent') : t('notifications_admin.logs.status.error')}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-bold">{new Date(log.sent_at).toLocaleString(t('language') === 'cn' ? 'zh-CN' : 'ru-RU')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          <div className="text-[10px] font-bold text-slate-500 max-w-[200px] truncate ml-auto">
                            {log.metadata ? JSON.parse(log.metadata).map((r: any) => `${r.roomName} (${r.unreadCount})`).join(', ') : '-'}
                          </div>
                          {log.error && (
                            <div className="text-[9px] text-rose-500 font-black uppercase tracking-tighter mt-0.5">
                              {log.error}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
