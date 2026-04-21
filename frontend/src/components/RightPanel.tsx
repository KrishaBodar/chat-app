import { Image as ImageIcon } from "lucide-react";

interface UserInfoPanelProps {
  name: string;
  email?: string;
  avatar?: string;
  online?: boolean;
  sharedImages?: string[];
}

/**
 * RightPanel — shows selected user info and shared images gallery.
 */
export function RightPanel({ name, email, avatar, online, sharedImages = [] }: UserInfoPanelProps) {
  return (
    <div className="w-72 h-full border-l border-border bg-card/50 flex flex-col">
      {/* User info header */}
      <div className="p-6 flex flex-col items-center border-b border-border">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          {online && (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-online border-3 border-card" />
          )}
        </div>
        <h3 className="font-bold text-foreground text-lg">{name}</h3>
        {email && <p className="text-sm text-muted-foreground">{email}</p>}
        <span
          className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${
            online
              ? "bg-online/10 text-online"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Shared images */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Shared Images</span>
          <span className="text-xs text-muted-foreground ml-auto">{sharedImages.length}</span>
        </div>

        {sharedImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {sharedImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center mt-4">No shared images yet</p>
        )}
      </div>
    </div>
  );
}
