<template>
	<div class="flex h-screen">

		<div class="flex-1 flex flex-col">

			<div class="p-4 overflow-auto">
				<!-- Tu tabla -->
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script
	setup
	lang="ts">

</script>
