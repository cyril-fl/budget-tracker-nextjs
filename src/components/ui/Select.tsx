'use client';

// Import
import { Icon } from '@iconify/react';
import { utilsIcons } from '@utils/utilsIcons';
import { Select as RdxSelect } from 'radix-ui';
import { Fragment, ReactNode, useCallback, useMemo, useState } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

// UI
const theme = tv({
	slots: {
		base: 'focus:ring-none inline-flex w-full items-center justify-between focus:outline-none',
		triggerIcon: ' ',
		value: 'placeholder:text-gray-400 placeholder-gray-400',
		label: ' tracking-wider  uppercase',
		content: 'z-50  focus:outline-none  w-[var(--radix-select-trigger-width)]',
		scrollButton: 'flex items-center justify-center',
		scrollIcon: '',
		separator: '',
	},
	variants: {
		variant: {
			nude: {
				base: 'font-bold',
				content: 'shadow-lg mt-1 w-full rounded-md',
				triggerIcon: 'text-grayscale-700',
				label: 'text-gray-400',
				scrollButton: 'text-gray-400',
				scrollIcon: 'text-grayscale-700',
				separator: 'my-1 border-t',
			},
		},
		color: {
			neutral: '',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: {
				base: 'px-3 py-2 text-sm rounded-md',
				content: ' border-gray-200 bg-white',
				triggerIcon: 'ml-2',
				label: 'px-2 py-1 text-xs font-semibold',
				scrollButton: 'p-2',
				scrollIcon: 'size-4',
				separator: ' border-gray-200',
			},
			lg: 'text-lg',
		},
	},
	compoundVariants: [],
	defaultVariants: {
		variant: 'nude',
		color: 'neutral',
		size: 'md',
	},
});
export type SelectVariants = VariantProps<typeof theme>;
// Define
export type SelectionGroup<T> = {
	label?: string;
	options: SelectionOption<T>[];
};
export type SelectionOption<T> = {
	value: T;
	displayValue: string;
};
export interface SelectProps<T> {
	placeholder?: string;
	defaultValue?: string;
	options: SelectionGroup<T> | SelectionGroup<T>[];
	onChange?: (value: T) => void;
	scrollButton?: boolean;
	className?: string;
	openIcon?: string;
	closeIcon?: string;
	ui?: Partial<typeof theme.slots>;
}

// Component
export function Select<T = string>(props: SelectProps<T>) {
	// Data
	const icons = utilsIcons();
	const [isOpen, setIsOpen] = useState(false);

	const SelectGroup: SelectionGroup<T>[] = Array.isArray(props.options)
		? props.options
		: [props.options];

	const ui = useMemo(() => theme(), []);

	// Methods
	const OpenIcon = useMemo(() => {
		const openIcon = props.openIcon ?? icons.chevronUp;
		const closeIcon = props.closeIcon ?? icons.chevronDown;
		const name = isOpen ? openIcon : closeIcon;
		return <Icon icon={name} />;
	}, [isOpen, icons, props.openIcon, props.closeIcon]);

	const ScrollButton = useCallback(
		(direction: 'up' | 'down') => {
			const icon = direction === 'up' ? icons.chevronUp : icons.chevronDown;

			const Component =
				direction === 'up'
					? RdxSelect.ScrollUpButton
					: RdxSelect.ScrollDownButton;

			return (
				props.scrollButton && (
					<Component className="flex items-center justify-center p-2 text-gray-400">
						<Icon icon={icon} className="size-4 text-blue-500" />
					</Component>
				)
			);
		},
		[isOpen, icons, props.scrollButton]
	);
	// Render
	return (
		<RdxSelect.Root onOpenChange={setIsOpen} defaultValue={props.defaultValue}>
			<RdxSelect.Trigger
				className={ui.base({
					className: [props.ui?.base, props.className],
				})}
			>
				<RdxSelect.Value placeholder={props.placeholder} />
				<RdxSelect.Icon
					className={ui.triggerIcon({
						className: [props.ui?.triggerIcon, props.className],
					})}
					asChild
				>
					{OpenIcon}
				</RdxSelect.Icon>
			</RdxSelect.Trigger>

			<RdxSelect.Portal>
				<RdxSelect.Content
					position="popper"
					side="bottom"
					sideOffset={0}
					align="center"
					className={ui.content({ className: props.ui?.content })}
				>
					{ScrollButton('up')}

					<RdxSelect.Viewport>
						{SelectGroup.map((group, index) => (
							<Fragment key={index}>
								<RdxSelect.Group>
									<RdxSelect.Label className={props.ui?.label}>
										{group.label}
									</RdxSelect.Label>

									{group.options.map((option) => (
										<SelectItem
											key={option.value as string}
											value={option.value as string}
										>
											{option.displayValue}
										</SelectItem>
									))}
								</RdxSelect.Group>
								{index !== SelectGroup.length - 1 && (
									<RdxSelect.Separator className={props.ui?.separator} />
								)}
							</Fragment>
						))}
					</RdxSelect.Viewport>

					{ScrollButton('down')}
				</RdxSelect.Content>
			</RdxSelect.Portal>
		</RdxSelect.Root>
	);
}
interface SelectItemProps {
	value: string;
	children?: ReactNode;
	className?: string;
}

export function SelectItem({ value, children }: SelectItemProps) {
	// Data
	const icons = utilsIcons();
	// Methods

	// Render
	return (
		<RdxSelect.Item
			value={value}
			// className={clsx(
			// 	'relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-700 transition-colors outline-none select-none',
			// 	'hover:bg-gray-100 data-[state=checked]:bg-blue-50 data-[state=checked]:font-medium',
			// 	'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
			// )}
		>
			<RdxSelect.ItemText>{children}</RdxSelect.ItemText>

			{/*<RdxSelect.ItemIndicator className="absolute right-3 data-[state=checked]:block data-[state=unchecked]:hidden">*/}
			{/*	<Icon icon={icons.check} className="size-4 text-blue-500" />*/}
			{/*</RdxSelect.ItemIndicator>*/}
		</RdxSelect.Item>
	);
}
