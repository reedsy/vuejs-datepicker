<template>
  <div
    v-show="showMonthView"
    :class="[
      calendarClass,
      'vdp-datepicker__calendar',
      {'vdp-datepicker__calendar-modal': modal},
      {'visible': showMonthView},
      monthsGridId,
    ]"
    :style="calendarStyle"
    role="dialog"
    :aria-modal="`${!inline}`"
    aria-label="Choose Month"
    @mousedown.prevent
  >
    <slot name="beforeCalendarHeader" />
    <header>
      <button
        type="button"
        class="prev"
        :disabled="isLeftNavDisabled || null"
        :aria-disabled="isLeftNavDisabled || null"
        :aria-label="isRtl ? 'Next Year' : 'Previous Year'"
        @click="isRtl ? nextYear() : previousYear()"
        @keydown.space.enter.prevent="isRtl ? nextYear() : previousYear()"
        @keydown="$emit('keydown', $event)"
      >
        &lt;
      </button>
      <button
        id="year-button"
        type="button"
        class="month__year_btn"
        :class="allowedToShowView('year') ? 'up' : ''"
        aria-live="polite"
        @click="showYearCalendar"
        @keydown.space.enter.prevent="showYearCalendar"
        @keydown="$emit('keydown', $event)"
      >
        {{ pageYearName }}
      </button>
      <button
        type="button"
        class="next"
        :aria-label="isRtl ? 'Previous Year' : 'Next Year'"
        :disabled="isRightNavDisabled || null"
        :aria-disabled="isRightNavDisabled || null"
        @click="isRtl ? previousYear() : nextYear()"
        @keydown.space.enter.prevent="isRtl ? previousYear() : nextYear()"
        @keydown="$emit('keydown', $event)"
      >
        &gt;
      </button>
    </header>
    <div
      aria-labelledby="year-button"
    >
      <button
        v-for="month in months"
        :key="month.timestamp"
        :aria-selected="month.isSelected"
        :class="{'selected': month.isSelected, 'disabled': month.isDisabled}"
        class="cell month"
        :role="month.isDisabled ? null : 'button'"
        :tabindex="month.isFocused ? 0 : -1"
        type="button"
        @keydown.right.prevent="focusNextMonth"
        @keydown.left.prevent="focusPreviousMonth"
        @keydown.down.prevent="focusNextQuarter"
        @keydown.up.prevent="focusPreviousQuarter"
        @keydown="$emit('keydown', $event)"
        @click.stop="selectMonth(month)"
      >
        {{ month.month }}
      </button>
    </div>
    <div>
      <slot name="afterCalendarContent" />
    </div>
  </div>
</template>
<script>
import { makeDateUtils } from '../utils/DateUtils';
import { ELEMENT_IDS } from '../config/ElementIds';
export default {
  props: {
    focusedDate: Number,
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    calendarClass: [ String, Object, Array ],
    calendarStyle: Object,
    translation: Object,
    modal: Boolean,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean,
    isInitialized: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'changedYear',
    'keydown',
    'selectMonth',
    'showYearCalendar',
    'update:focusedDate',
  ],
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      monthsGridId: ELEMENT_IDS.monthGrid,
      utils: constructedDateUtils,
    };
  },
  computed: {
    months () {
      const d = this.pageDate;
      const months = [];
      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
        : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());
      for (let i = 0; i < 12; i++) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.getTime(),
          isFocused: this.isFocusedMonth(dObj),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj),
        });
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
      }
      return months;
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName () {
      const yearSuffix = this.translation.yearSuffix;
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`;
    },
    /**
     * Is the left hand navigation disabled
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextYearDisabled(this.pageTimestamp)
        : this.isPreviousYearDisabled(this.pageTimestamp);
    },
    /**
     * Is the right hand navigation disabled
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousYearDisabled(this.pageTimestamp)
        : this.isNextYearDisabled(this.pageTimestamp);
    },
  },
  watch: {
    showMonthView() {
      if (this.showMonthView && this.isInitialized) {
        this.focusMonthCell();
      }
    },
  },
  methods: {
    async focusMonthCell() {
      await this.$nextTick();
      const focusableMonth = this.$el.querySelector('.month[tabindex="0"]');
      if (focusableMonth) {
        focusableMonth.focus();
      }
    },
    focusNextMonth() {
      const newDate = new Date(this.focusedDate);
      this.utils.setMonth(newDate, newDate.getMonth() + 1, this.useUtc);
      this.moveFocus(newDate);
    },
    focusPreviousMonth () {
      const newDate = new Date(this.focusedDate);
      this.utils.setMonth(newDate, newDate.getMonth() - 1, this.useUtc);
      this.moveFocus(newDate);
    },
    focusNextQuarter() {
      const newDate = new Date(this.focusedDate);
      this.utils.setMonth(newDate, newDate.getMonth() + 3, this.useUtc);
      this.moveFocus(newDate);
    },
    focusPreviousQuarter () {
      const newDate = new Date(this.focusedDate);
      this.utils.setMonth(newDate, newDate.getMonth() - 3, this.useUtc);
      this.moveFocus(newDate);
    },
    /**
     * Emits a selectMonth event
     * @param {Object} month
     * @return {Boolean}
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false;
      }
      this.$emit('selectMonth', month);
    },
    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear (incrementBy) {
      const date = this.pageDate;
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
      this.$emit('changedYear', date);
    },
    /**
     * Decrements the year
     */
    previousYear () {
      if (!this.isPreviousYearDisabled()) {
        const focusedDate = new Date(this.focusedDate);
        this.utils.setFullYear(focusedDate, this.utils.getFullYear(focusedDate) - 1, this.useUtc);
        this.moveFocus(focusedDate, false);
      }
    },
    /**
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    isPreviousYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }
      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate);
    },
    /**
     * Increments the year
     */
    nextYear () {
      if (!this.isNextYearDisabled()) {
        const focusedDate = new Date(this.focusedDate);
        this.utils.setFullYear(focusedDate, this.utils.getFullYear(focusedDate) + 1, this.useUtc);
        this.moveFocus(focusedDate, false);
      }
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isNextYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }
      return this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(this.pageDate);
    },
    /**
     * Emits an event that shows the year calendar
     */
    showYearCalendar () {
      this.$emit('showYearCalendar');
    },
    /**
     * Whether the selected date is in this month
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) &&
        this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date));
    },
    /**
     * Whether the focused date is in this month
     * @param {Date} date
     * @return {Boolean}
     */
    isFocusedMonth (date) {
      const focusedDate = new Date(this.focusedDate);
      return (focusedDate &&
        this.utils.getFullYear(focusedDate) === this.utils.getFullYear(date) &&
        this.utils.getMonth(focusedDate) === this.utils.getMonth(date));
    },
    /**
     * Whether a month is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledMonth (date) {
      let disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (
          (this.utils.getMonth(date) < this.utils.getMonth(this.disabledDates.to) && this.utils.getFullYear(date) <= this.utils.getFullYear(this.disabledDates.to)) ||
          this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)
        ) {
          disabledDates = true;
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (
          (this.utils.getMonth(date) > this.utils.getMonth(this.disabledDates.from) && this.utils.getFullYear(date) >= this.utils.getFullYear(this.disabledDates.from)) ||
          this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)
        ) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }
      return disabledDates;
    },
    moveFocus(newDate, focusCell = true) {
      const yearsDifference = this.utils.getFullYear(newDate) - this.utils.getFullYear(this.pageDate);
      if (!!yearsDifference) {
        this.changeYear(yearsDifference);
      }

      this.$emit('update:focusedDate', newDate.getTime());

      if (focusCell) {
        this.focusMonthCell();
      }
    },
  },
};
</script>
