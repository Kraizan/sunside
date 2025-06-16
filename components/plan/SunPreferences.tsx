import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sunrise, Sunset } from "lucide-react";
import type { SunPreference } from "@/types/flight";

interface SunPreferencesProps {
  sunPreference: SunPreference;
  onPreferenceChange: (preference: SunPreference) => void;
}

export function SunPreferences({
  sunPreference,
  onPreferenceChange,
}: SunPreferencesProps) {
  const handleCheckbox = (name: string, checked: boolean) => {
    onPreferenceChange({
      ...sunPreference,
      [name]: checked,
      priority:
        name === "wantsSunrise" && checked
          ? "SUNRISE"
          : name === "wantsSunset" && checked
          ? "SUNSET"
          : sunPreference.priority,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <p className="text-lg font-semibold text-foreground">Sun Preferences</p>
      <div className="grid gap-1.5">
        <CheckboxOption
          id="wantsSunrise"
          checked={sunPreference.wantsSunrise}
          onChange={handleCheckbox}
          icon={<Sunrise className="h-5 w-5 text-amber-500" />}
          label="I want to see the sunrise"
        />

        <CheckboxOption
          id="wantsSunset"
          checked={sunPreference.wantsSunset}
          onChange={handleCheckbox}
          icon={<Sunset className="h-5 w-5 text-orange-500" />}
          label="I want to see the sunset"
        />

        {sunPreference.wantsSunrise && sunPreference.wantsSunset && (
          <PrioritySelection
            priority={sunPreference.priority}
            onChange={(priority) =>
              onPreferenceChange({ ...sunPreference, priority })
            }
          />
        )}
      </div>
    </div>
  );
}

interface CheckboxOptionProps {
  id: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
  icon: React.ReactNode;
  label: string;
}

function CheckboxOption({
  id,
  checked,
  onChange,
  icon,
  label,
}: CheckboxOptionProps) {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent transition-colors">
      <Checkbox
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={(checked: boolean) => onChange(id, checked)}
        className="data-[state=checked]:bg-chart-3 data-[state=checked]:text-white dark:data-[state=checked]:border-chart-3 dark:data-[state=checked]:bg-chart-3"
      />
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        {icon}
        <span>{label}</span>
      </Label>
    </div>
  );
}

interface PrioritySelectionProps {
  priority: "SUNRISE" | "SUNSET" | null;
  onChange: (priority: "SUNRISE" | "SUNSET") => void;
}

function PrioritySelection({ priority, onChange }: PrioritySelectionProps) {
  return (
    <div className="mt-4 p-3 space-y-2">
      <Label className="text-sm text-muted-foreground">
        Which do you prefer to see more?
      </Label>
      <RadioGroup
        value={priority || ""}
        onValueChange={(value) => onChange(value as "SUNRISE" | "SUNSET")}
        className="gap-3"
      >
        <RadioOption
          value="SUNRISE"
          icon={<Sunrise className="h-4 w-4 text-amber-500" />}
          label="Prioritize Sunrise"
        />
        <RadioOption
          value="SUNSET"
          icon={<Sunset className="h-4 w-4 text-orange-500" />}
          label="Prioritize Sunset"
        />
      </RadioGroup>
    </div>
  );
}

interface RadioOptionProps {
  value: string;
  icon: React.ReactNode;
  label: string;
}

function RadioOption({ value, icon, label }: RadioOptionProps) {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors">
      <RadioGroupItem
        value={value}
        id={`${value.toLowerCase()}-priority`}
        className="border-chart-3 text-chart-3"
      />
      <Label
        htmlFor={`${value.toLowerCase()}-priority`}
        className="flex items-center gap-2 cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </Label>
    </div>
  );
}
