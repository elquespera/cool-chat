import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ComponentProps, useState } from "react";
import { IconButton } from "../common/icon-button";
import { UserAvatar } from "./user-avatar";

type AvatarPickerProps = {
  count?: number;
  url: string;
  onUrlChange: (url: string) => void;
} & ComponentProps<"div">;

export function AvatarPicker({
  url,
  onUrlChange,
  count = 20,
  className,
  ...props
}: AvatarPickerProps) {
  const [avatars, setAvatars] = useState(generateAvatars(count));

  const handleRegenerateClick = () => {
    setAvatars(generateAvatars(count));
    onUrlChange("");
  };

  return (
    <div className={cn("relative rounded-md border p-4", className)} {...props}>
      <ToggleGroup
        type="single"
        className="flex-wrap justify-start"
        value={url}
        onValueChange={onUrlChange}
      >
        {avatars.map((url) => (
          <ToggleGroupItem key={url} value={url} className="h-12 w-12">
            <UserAvatar key={url} avatarUrl={url} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <IconButton
        icon={<UpdateIcon />}
        toolTip="Regenerate"
        toolTipSide="left"
        className="absolute right-0 top-0 h-7 w-7"
        variant="ghost"
        onClick={handleRegenerateClick}
      />
    </div>
  );
}

function generateAvatars(length: number) {
  return Array.from({ length }).map(
    (_) =>
      `https://avataaars.io/?avatarStyle=Transparent&` +
      Object.entries(avatarStyles)
        .map(
          ([key, values]) =>
            `${key}=${values[Math.round(Math.random() * values.length)]}`,
        )
        .join("&"),
  );
}

const avatarStyles = {
  topType: [
    "NoHair",
    "Eyepatch",
    "Hat",
    "Hijab",
    "Turban",
    "WinterHat1",
    "WinterHat2",
    "WinterHat3",
    "WinterHat4",
    "LongHairBigHair",
    "LongHairBob",
    "LongHairBun",
    "LongHairCurly",
    "LongHairCurvy",
    "LongHairDreads",
    "LongHairFrida",
    "LongHairFro",
    "LongHairFroBand",
    "LongHairNotTooLong",
    "LongHairShavedSides",
    "LongHairMiaWallace",
    "LongHairStraight",
    "LongHairStraight2",
    "LongHairStraightStrand",
    "ShortHairDreads01",
    "ShortHairDreads02",
    "ShortHairFrizzle",
    "ShortHairShaggyMullet",
    "ShortHairShortCurly",
    "ShortHairShortFlat",
    "ShortHairShortRound",
    "ShortHairShortWaved",
    "ShortHairSides",
    "ShortHairTheCaesar",
    "ShortHairTheCaesarSidePart",
  ],
  facialHairType: [
    "Blank",
    "BeardMedium",
    "BeardLight",
    "BeardMajestic",
    "MoustacheFancy",
    "MoustacheMagnum",
  ],
  facialHairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red",
  ],
  clotheType: [
    "BlazerShirt",
    "BlazerSweater",
    "CollarSweater",
    "GraphicShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "ShirtScoopNeck",
    "ShirtVNeck",
  ],
  clotheColor: [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White",
  ],
  eyeType: [
    "Close",
    "Cry",
    "Default",
    "Dizzy",
    "EyeRoll",
    "Happy",
    "Hearts",
    "Side",
    "Squint",
    "Surprised",
    "Wink",
    "WinkWacky",
  ],
  eyebrowType: [
    "Angry",
    "AngryNatural",
    "Default",
    "DefaultNatural",
    "FlatNatural",
    "RaisedExcited",
    "RaisedExcitedNatural",
    "SadConcerned",
    "SadConcernedNatural",
    "UnibrowNatural",
    "UpDown",
    "UpDownNatural",
  ],
  mouthType: [
    "Concerned",
    "Default",
    "Disbelief",
    "Eating",
    "Grimace",
    "Sad",
    "ScreamOpen",
    "Serious",
    "Smile",
    "Tongue",
    "Twinkle",
    "Vomit",
  ],
  skinColor: [
    "Tanned",
    "Yellow",
    "Pale",
    "Light",
    "Brown",
    "DarkBrown",
    "Black",
  ],
};
