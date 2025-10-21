import { Label } from "@/components/ui/label";
import { PREDEFINED_JOB_ROLES, type JobRole } from "@/lib/cv-analysis";

interface JobRoleSelectorProps {
  selectedRole?: JobRole;
  onRoleSelect: (role: JobRole) => void;
}

export default function JobRoleSelector({ selectedRole, onRoleSelect }: JobRoleSelectorProps) {
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = event.target.value;
    if (roleId === "") {
      return;
    }
    const role = PREDEFINED_JOB_ROLES[parseInt(roleId)];
    if (role) {
      onRoleSelect(role);
    }
  };

  // Group roles by industry for better organization
  const groupedRoles = PREDEFINED_JOB_ROLES.reduce((acc, role, index) => {
    if (!acc[role.industry]) {
      acc[role.industry] = [];
    }
    acc[role.industry].push({ ...role, id: index });
    return acc;
  }, {} as Record<string, Array<JobRole & { id: number }>>);

  return (
    <div className="space-y-2">
      <label htmlFor="job-role-select" className="text-sm font-medium block">
        Select Target Job Role (Optional)
      </label>
      <select
        id="job-role-select"
        onChange={handleRoleChange}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        defaultValue=""
      >
        <option value="" disabled>
          Choose a role for targeted analysis...
        </option>
        {Object.entries(groupedRoles).map(([industry, roles]) => (
          <optgroup key={industry} label={industry}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.level} Level)
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedRole && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Selected:</strong> {selectedRole.title} in {selectedRole.industry} ({selectedRole.level} Level)
          </p>
        </div>
      )}
    </div>
  );
}