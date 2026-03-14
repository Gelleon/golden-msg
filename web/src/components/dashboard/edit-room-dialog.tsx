"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Hash, AlignLeft, Users, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { updateRoom } from "@/app/actions/room"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно содержать минимум 2 символа.",
  }),
  description: z.string().optional(),
  capacity: z.coerce.number().min(0, {
    message: "Вместимость не может быть отрицательной.",
  }),
  equipment: z.string().optional(),
})

interface EditRoomDialogProps {
  room: {
    id: string
    name: string | null
    description: string | null
    capacity: number | null
    equipment: string | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditRoomDialog({ room, open, onOpenChange, onSuccess }: EditRoomDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name || "",
      description: room.description || "",
      capacity: room.capacity || 0,
      equipment: room.equipment || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await updateRoom(room.id, values)
      
      if (result.success) {
        toast({
          title: "Успех",
          description: "Информация о комнате обновлена.",
        })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось обновить комнату.",
          variant: "destructive" as any,
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка.",
        variant: "destructive" as any,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0F172A] border-white/10 text-white overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
        <DialogHeader className="pt-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Редактировать комнату
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Измените параметры помещения. Все изменения будут зафиксированы в логах.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Название</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        {...field}
                        className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Описание</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Textarea
                        {...field}
                        className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white min-h-[80px] rounded-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Вместимость</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          type="number"
                          {...field}
                          className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Оборудование</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          {...field}
                          placeholder="ТВ, Кондиционер..."
                          className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg shadow-amber-500/20 border-0 transition-all duration-300"
              >
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
