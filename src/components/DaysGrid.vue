<template>
  <div
    aria-labelledby="month-button"
  >
    <span
      v-for="d in daysOfWeek"
      :key="d.timestamp"
      class="cell day-header"
    >{{ d }}</span>
    <template v-if="blankDays > 0">
      <span
        v-for="d in blankDays"
        :key="d.timestamp"
        class="cell day blank"
      />
    </template>
    <!--
      The two branches below are deliberately kept separate: a single element
      cannot carry both `v-html` and (conditional) children without Vue warning
      that the `innerHTML` prop overrides its children.
    -->
    <template v-if="$slots.dayCell">
      <span
        v-for="day in days"
        :key="day.timestamp"
        :aria-selected="day.isSelected"
        class="cell day"
        :class="dayClasses(day)"
        :role="day.isDisabled ? null : 'button'"
        :tabindex="isFocused(day) ? 0 : -1"
        @mouseover="mouseOver(day)"
        @focus="mouseOver(day)"
        @keydown="onKeydown(day, $event)"
        @click="selectDate(day)"
      >
        <slot
          name="dayCell"
          :day="day"
          :date="new Date(day.timestamp)"
          :is-disabled="day.isDisabled"
          :is-selected="day.isSelected"
        />
      </span>
    </template>
    <template v-else>
      <span
        v-for="day in days"
        :key="day.timestamp"
        :aria-selected="day.isSelected"
        class="cell day"
        :class="dayClasses(day)"
        :role="day.isDisabled ? null : 'button'"
        :tabindex="isFocused(day) ? 0 : -1"
        @mouseover="mouseOver(day)"
        @focus="mouseOver(day)"
        @keydown="onKeydown(day, $event)"
        @click="selectDate(day)"
        v-html="dayCellContent(day)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'DaysGrid',
  props: {
    dayCellContent: {
      type: Function,
      default: day => day.date,
    },
    days: Array,
    focusedDate: {
      type: Number,
    },
    mondayFirst: Boolean,
    translation: Object,
    startDate: Date,
    useUtc: Boolean,
    utils: Object,
  },
  emits: [
    'focus-next-day',
    'focus-next-week',
    'focus-previous-day',
    'focus-previous-week',
    'keydown',
    'mouseover',
    'select',
  ],
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek () {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }
      return this.translation.days;
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays () {
      const d = this.startDate;
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
      }
      return this.utils.getDay(dObj);
    },
  },
  methods: {
    onKeydown (day, event) {
      switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.$emit('focus-previous-day');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.$emit('focus-next-day');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.$emit('focus-previous-week');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.$emit('focus-next-week');
        break;
      case ' ':
      case 'Spacebar':
      case 'Enter':
        event.preventDefault();
        this.selectDate(day);
        break;
      }
      this.$emit('keydown', event);
    },
    dayClasses (day) {
      return {
        selected: day.isSelected,
        disabled: day.isDisabled,
        highlighted: day.isHighlighted,
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd,
      };
    },
    isFocused(day) {
      const date = new Date(day.timestamp);
      const focusedDate = new Date(this.focusedDate);
      return this.utils.compareDates(date, focusedDate);
    },
    mouseOver (date) {
      this.$emit('mouseover', date);
    },
    selectDate (date) {
      this.$emit('select', date);
    },
  },
};
</script>

<style scoped>

</style>
