export const ScaInitiationDropdown = ({
  scaMethods,
  selectedMethodId,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scaMethods: any[]
  selectedMethodId: string | null
  onChange: (id: string) => void
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-white">
        Choose authentication method:
      </label>
      <select
        value={selectedMethodId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded bg-[#1C1C1C] text-white border border-gray-700"
      >
        <option value="" disabled>
          -- Select method --
        </option>
        {scaMethods.map((method) => (
          <option key={method.authenticationMethodId} value={method.authenticationMethodId}>
            {method.name} – {method.explanation}
          </option>
        ))}
      </select>
    </div>
  )
}
