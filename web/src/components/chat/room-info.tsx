"use client";

import { useEffect, useState, useCallback } from "react";
import { getRoomDetails, searchUsersForRoom, addParticipant, removeParticipant } from "@/app/actions/room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, Plus, UserPlus, Shield, User, Crown, MoreVertical, Trash2, ShieldAlert, Briefcase, Handshake } from "lucide-react";
import { useTranslation } from "@/lib/language-context";

interface Participant {
  id: string;
  full_name?: string | null;
  name?: string | null;
  email?: string;
  role?: string; // global role
  room_role?: string; // "owner", "admin", "member"
  avatar_url?: string | null;
  avatarUrl?: string | null;
}

export const RoomInfo = ({ roomId }: { roomId: string }) => {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomCreator, setRoomCreator] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>("group");
  const [currentUser, setCurrentUser] = useState<{id: string, role: string} | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eligibleUsers, setEligibleUsers] = useState<Participant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We'll implement a basic online status logic if useOnlineStatus is not available.
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  const PAGE_SIZE = 5;

  const fetchParticipants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRoomDetails(roomId);
      if (data) {
        setParticipants(data.participants);
        setRoomCreator(data.room?.created_by || null);
        setRoomType(data.room?.type || "group");
        setCurrentUser(data.currentUser);
      } else {
        setParticipants([]);
      }
    } catch {
      setError("Failed to fetch participants");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Fetch participants on mount and set up SSE
  useEffect(() => {
    fetchParticipants();

    // SSE Connection for real-time participant updates
    const sse = new EventSource(`/api/sse?roomId=${roomId}`);

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "participant_added" || data.type === "participant_removed" || data.type === "participant_updated") {
          fetchParticipants();
        }
      } catch (e) {
        console.error("SSE Parse Error", e);
      }
    };

    sse.onerror = (e) => {
      console.error("[SSE Room Info] Error:", e);
    };

    // WebSocket for online status updates (fallback/example as per summary)
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.host}`;
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${wsUrl}/online-status`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "onlineUsersUpdate") {
          setOnlineUsers(data.users);
        }
      };
    } catch {
      console.error("Failed to connect to WebSocket for online status");
    }

    return () => {
      sse.close();
      if (ws) ws.close();
    };
  }, [roomId, fetchParticipants]);

  // Search eligible users (exclude existing participants)
  useEffect(() => {
    const fetchEligibleUsers = async () => {
      if (!isAddUserDialogOpen) return;
      setIsLoading(true);
      try {
        const result = await searchUsersForRoom(searchQuery);
        if (result && Array.isArray(result)) {
          const participantIds = new Set(participants.map(p => p.id));
          setEligibleUsers(result.filter(u => !participantIds.has(u.id)));
        } else {
          setEligibleUsers([]);
        }
      } catch {
        setError("Error searching users");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchEligibleUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAddUserDialogOpen, participants]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(eligibleUsers.length / PAGE_SIZE));
  const paginatedUsers = eligibleUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await addParticipant(roomId, userId);
      if (result.success) {
        setIsAddUserDialogOpen(false);
        await fetchParticipants();
      } else {
        setError(result.error || t("roomInfo.addUserError") || "Failed to add user");
      }
    } catch {
      setError(t("roomInfo.addUserError") || "Error adding user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await removeParticipant(roomId, userId);
      if (result.success) {
        await fetchParticipants();
      } else {
        setError(result.error || "Failed to remove user");
      }
    } catch {
      setError("Error removing user");
    } finally {
      setIsLoading(false);
    }
  };

  const isGlobalAdminOrManager = currentUser?.role === "admin" || currentUser?.role === "manager";
  const isCreator = currentUser?.id === roomCreator;
  const currentUserRoomRole = participants.find(p => p.id === currentUser?.id)?.room_role;
  const isRoomAdmin = currentUserRoomRole === "admin" || currentUserRoomRole === "owner";
  
  const canManageRoom = isGlobalAdminOrManager || isCreator || isRoomAdmin;

  const getGlobalRoleText = (role?: string) => {
    switch (role) {
      case 'admin': return t("roomInfo.roleSystemAdmin") || "Администратор";
      case 'manager': return t("roomInfo.roleManager") || "Менеджер";
      case 'partner': return t("roomInfo.rolePartner") || "Партнер";
      case 'client':
      default: return t("roomInfo.roleClient") || "Клиент";
    }
  };

  const getGlobalRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-slate-400 mr-2" />;
      case 'manager': return <Briefcase className="h-4 w-4 text-purple-400 mr-2" />;
      case 'partner': return <Handshake className="h-4 w-4 text-emerald-400 mr-2" />;
      case 'client':
      default: return <User className="h-4 w-4 text-slate-400 mr-2" />;
    }
  };

  const getGlobalRoleBadgeIcon = (role?: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3 mr-1" />;
      case 'manager': return <Briefcase className="h-3 w-3 mr-1" />;
      case 'partner': return <Handshake className="h-3 w-3 mr-1" />;
      case 'client':
      default: return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getGlobalRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'admin': return "text-slate-400 bg-slate-400/10";
      case 'manager': return "text-purple-400 bg-purple-400/10";
      case 'partner': return "text-emerald-400 bg-emerald-400/10";
      case 'client':
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const getCurrentUserRoleText = () => {
    return getGlobalRoleText(currentUser?.role);
  };

  const getCurrentUserRoleIcon = () => {
    return getGlobalRoleIcon(currentUser?.role);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Current User Role Info */}
      <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
        <span className="text-sm text-slate-300">{t("roomInfo.yourRole") || "Ваша роль"}:</span>
        <div className="flex items-center font-medium text-slate-100">
          {getCurrentUserRoleIcon()}
          {getCurrentUserRoleText()}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{t("roomInfo.participantsTitle") || "Участники комнаты"}</h3>
        {canManageRoom && roomType !== "private" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddUserDialogOpen(true)}
            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-2"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="text-xs">{t("roomInfo.addUserButton") || "Добавить"}</span>
          </Button>
        )}
      </div>

      {error && <div className="text-red-400 text-xs mb-3">{error}</div>}

      <div className="space-y-2">
        {participants.map((participant) => {
          const isParticipantCreator = participant.id === roomCreator;
          const isParticipantAdmin = participant.room_role === "admin";
          
          return (
            <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={participant.avatarUrl || participant.avatar_url || undefined} alt={participant.name || participant.full_name || "User"} />
                    <AvatarFallback className="bg-slate-800 text-xs text-slate-400">
                      {(participant.name || participant.full_name)?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(participant.id) && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0F172A]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-slate-200 truncate">{participant.name || participant.full_name || "Unknown"}</div>
                    
                    <span className={`flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded ${getGlobalRoleBadgeClass(participant.role)}`}>
                      {getGlobalRoleBadgeIcon(participant.role)}
                      {getGlobalRoleText(participant.role)}
                    </span>

                    {isParticipantCreator && (
                      <span className="flex items-center text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <Crown className="h-3 w-3 mr-1" />
                        {t("roomInfo.roleCreator") || "Создатель"}
                      </span>
                    )}
                    {!isParticipantCreator && isParticipantAdmin && (
                      <span className="flex items-center text-[10px] font-medium text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        {t("roomInfo.roleAdmin") || "Админ"}
                      </span>
                    )}
                    {participant.id === currentUser?.id && (
                      <span className="text-[10px] font-medium text-slate-500 ml-1">
                        {t("roomInfo.you") || "(Вы)"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {canManageRoom && !isParticipantCreator && roomType !== "private" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0F172A] border-white/10 text-white min-w-[160px]">
                    <DropdownMenuLabel className="text-xs text-slate-400">{t("roomInfo.manageTitle") || "Управление"}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => handleRemoveUser(participant.id)}
                      className="text-sm cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("roomInfo.removeUser") || "Удалить"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
        {participants.length === 0 && !isLoading && (
          <div className="text-xs text-slate-500 text-center py-2">{t("roomInfo.noParticipants") || "Нет участников"}</div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={(open) => {
        setIsAddUserDialogOpen(open);
        if (!open) {
          setSearchQuery("");
          setCurrentPage(1);
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-[#0F172A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t("roomInfo.addUserDialogTitle") || "Добавить пользователя"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder={t("roomInfo.searchUserPlaceholder") || "Поиск по имени..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
                className="pl-9 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-10 rounded-xl"
              />
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {isLoading && eligibleUsers.length === 0 ? (
                <div className="text-slate-400 text-center p-4 text-xs">{t("roomInfo.loadingUsers") || "Загрузка..."}</div>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || user.avatar_url || undefined} alt={user.name || user.full_name || ""} />
                        <AvatarFallback className="bg-slate-800 text-slate-400">
                          {(user.name || user.full_name)?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{user.name || user.full_name}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddUser(user.id)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-center py-4 text-xs">
                  {t("roomInfo.noUsersFound") || "Нет доступных пользователей"}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                >
                  {t("common.prev") || "Пред."}
                </Button>
                <span className="text-xs text-slate-500">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                >
                  {t("common.next") || "След."}
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddUserDialogOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              {t("common.cancel") || "Отмена"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
