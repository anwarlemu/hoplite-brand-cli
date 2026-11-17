import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";

const PHOTO = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='#929291'/><circle cx='20' cy='16' r='7' fill='#C2C2C0'/><rect x='8' y='26' width='24' height='14' rx='12' fill='#C2C2C0'/></svg>");

export function Preview() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={PHOTO} alt="Maya" />
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
      <Avatar shape="cut">
        <AvatarFallback>JO</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AI</AvatarFallback>
        <AvatarBadge className="bg-success" aria-label="Running" />
      </Avatar>
    </div>
  );
}

export function Group() {
  return (
    <div className="grid gap-6">
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={PHOTO} alt="Jonah" />
          <AvatarFallback>JO</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>LI</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>JO</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>LI</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  );
}
