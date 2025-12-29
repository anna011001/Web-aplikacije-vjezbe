<template>
  <div class="w-full">
    <div class="relative h-2 bg-slate-200 rounded-full" ref="track">
      <!-- Active range highlight -->
      <div 
        class="absolute h-2 bg-slate-600 rounded-full"
        :style="{ left: leftPercent + '%', right: (100 - rightPercent) + '%' }"
      ></div>
      
      <!-- Left handle -->
      <div
        class="absolute w-3 h-3 bg-white border-2 border-slate-600 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"
        :style="{ left: 'calc(' + leftPercent + '% - 7px)', top: '-2px' }"
        @mousedown="startDrag($event, 'left')"
        @touchstart="startDrag($event, 'left')"
      ></div>
      
      <!-- Right handle -->
      <div
        class="absolute w-3 h-3 bg-white border-2 border-slate-600 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"
        :style="{ left: 'calc(' + rightPercent + '% - 7px)', top: '-2px' }"
        @mousedown="startDrag($event, 'right')"
        @touchstart="startDrag($event, 'right')"
      ></div>
    </div>
    
    <div class="flex justify-between items-center mt-1">
      <div class="text-sm text-slate-600">
        ${{ minValue }}
      </div>
      <div class="text-sm text-slate-600">
        ${{ maxValue }}
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed } from 'vue';
 
const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  initialMin: {
    type: Number,
    default: null
  },
  initialMax: {
    type: Number,
    default: null
  }
});
 
const emit = defineEmits(['update:minValue', 'update:maxValue', 'change']);
 
const track = ref(null);
const minValue = ref(props.initialMin ?? props.min);
const maxValue = ref(props.initialMax ?? props.max);
const isDragging = ref(false);
const activeHandle = ref(null);
 
const leftPercent = computed(() => {
  return ((minValue.value - props.min) / (props.max - props.min)) * 100;
});
 
const rightPercent = computed(() => {
  return ((maxValue.value - props.min) / (props.max - props.min)) * 100;
});
 
const startDrag = (e, handle) => {
  e.preventDefault();
  isDragging.value = true;
  activeHandle.value = handle;
  
  const moveHandler = (e) => handleMove(e);
  const upHandler = () => {
    isDragging.value = false;
    activeHandle.value = null;
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', upHandler);
    document.removeEventListener('touchmove', moveHandler);
    document.removeEventListener('touchend', upHandler);
    
    emit('change', { min: minValue.value, max: maxValue.value });
  };
  
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', upHandler);
  document.addEventListener('touchmove', moveHandler);
  document.addEventListener('touchend', upHandler);
};
 
const handleMove = (e) => {
  if (!isDragging.value || !track.value) return;
  
  const rect = track.value.getBoundingClientRect();
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  let percent = ((clientX - rect.left) / rect.width) * 100;
  
  percent = Math.max(0, Math.min(100, percent));
  
  const value = Math.round(props.min + (percent / 100) * (props.max - props.min));
  
  if (activeHandle.value === 'left') {
    const newMin = Math.min(value, maxValue.value);
    minValue.value = newMin;
    emit('update:minValue', newMin);
  } else {
    const newMax = Math.max(value, minValue.value);
    maxValue.value = newMax;
    emit('update:maxValue', newMax);
  }
};
</script>