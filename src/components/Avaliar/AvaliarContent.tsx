import { useState } from "react"
import { CardContent } from "../ui/card"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export function AvaliarContent({ criterio }: { criterio: string }) {
	const [values, setValues] = useState({
		"1": "",
		"2": "",
		"3": "",
		"4": "",
		"5": "",
	})

	const handleValueChange = (newValue: string, currentPage: string) => {
		setValues((prevValues) => ({
			...prevValues,
			[currentPage]: newValue,
		}))
	}
	return (
		<CardContent>
			<p>{criterio}</p>
			<ToggleGroup
				type="single"
				size={"lg"}
				variant="outline"
				className="flex flex-wrap gap-2"
				value={values["1"]}
				onValueChange={(value) => handleValueChange(value, "1")}
			>
				{Array.from({ length: 10 }, (_, index) => (
					<ToggleGroupItem
						key={`${(index + 1).toString()}`}
						value={(index + 1).toString()}
						aria-label={`Toggle item ${index + 1}`}
					>
						{index + 1}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</CardContent>
	)
}
