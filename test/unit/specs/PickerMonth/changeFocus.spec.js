import PickerMonth from '@/components/PickerMonth.vue'
import {mount} from '@vue/test-utils'
import {en} from '@/locale'

describe('PickerMonth: changing focus', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        pageDate: new Date(Date.UTC(2018, 0, 1)),
        selectedDate: new Date(Date.UTC(2018, 2, 24)),
        focusedDate: new Date(Date.UTC(2018, 1, 15)).getTime(),
        useUtc: true,
      },
      attachToDocument: true
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('focusNextMonth', () => {
    it('changes the focused date to the next month', () => {
      wrapper.vm.focusNextMonth();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 2, 15)).getTime()]])
    })

    it('changes to the next year if the current focused date is the last month of the year', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 11, 28)).getTime()})
      wrapper.vm.focusNextMonth();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2019, 0, 28)).getTime()]])
    })

    it('displays the next year if the current focused date is the last month of the year', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 1, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 11, 28)).getTime(),
      })
      wrapper.vm.focusNextMonth();
      expect(wrapper.emitted('changedYear')).toEqual([[new Date(Date.UTC(2019, 1, 1))]])
    })


    it('focuses on the new focused month after it changes', async () => {
      // fake the .sync prop update
      wrapper.setProps({
        focusedDate: new Date(Date.UTC(2018, 2, 15)).getTime()
      })
      wrapper.vm.focusNextMonth()
      await wrapper.vm.$nextTick()
      expect(document.activeElement.textContent).toEqual('March')
      wrapper.vm.focusNextMonth()
      wrapper.setProps({
        focusedDate: new Date(Date.UTC(2018, 3, 15)).getTime()
      })
      await wrapper.vm.$nextTick()
      expect(document.activeElement.textContent).toEqual('April')
    })
  })

  describe('focusPreviousMonth', () => {
    it('changes the focused date to the previous month', () => {
      wrapper.vm.focusPreviousMonth();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 0, 15)).getTime()]])
    })

    it('changes to the previous year if the current focused date is the first month of the year', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 0, 1)).getTime()})
      wrapper.vm.focusPreviousMonth();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2017, 11, 1)).getTime()]])
    })

    it('displays the previous year if the current focused date is the first month of the year', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 0, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 0, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 0, 1)).getTime(),
      })
      wrapper.vm.focusPreviousMonth();
      expect(wrapper.emitted('changedYear')).toEqual([[new Date(Date.UTC(2017, 0, 1))]])
    })
  })

  describe('focusNextQuarter', () => {
    it('changes the focused date to the next quarter', () => {
      wrapper.vm.focusNextQuarter();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 4, 15)).getTime()]])
    })

    it('changes to the next year if the current focused date is the last quarter of the year', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 10, 11)).getTime(),
      })
      wrapper.vm.focusNextQuarter();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2019, 1, 11)).getTime()]])
    })

    it('displays the next year if the current focused date is the last quarter of the year', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 11, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 11, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 11, 26)).getTime(),
      })
      wrapper.vm.focusNextQuarter();
      expect(wrapper.emitted('changedYear')).toEqual([[new Date(Date.UTC(2019, 11, 1))]])
    })
  })

  describe('focusPreviousQuarter', () => {
    it('changes the focused date to the previous quarter', () => {
      wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 11, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 11, 15)).getTime(),
      })
      wrapper.vm.focusPreviousQuarter();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2018, 8, 15)).getTime()]])
    })

    it('changes to the previous year if the current focused date is the first quarter of the year', () => {
      wrapper.setProps({focusedDate: new Date(Date.UTC(2018, 1, 6)).getTime()})
      wrapper.vm.focusPreviousQuarter();
      expect(wrapper.emitted('update:focusedDate')).toEqual([[new Date(Date.UTC(2017, 10, 6)).getTime()]])
    })

    it('displays the previous year if the current focused date is the first quarter of the year', () => {
      wrapper.setProps({
        pageDate: new Date(Date.UTC(2018, 2, 1)),
        pageTimestamp: new Date(Date.UTC(2018, 2, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 2, 5)).getTime(),
      })
      wrapper.vm.focusPreviousQuarter();
      expect(wrapper.emitted('changedYear')).toEqual([[new Date(Date.UTC(2017, 2, 1))]])
    })
  })

  it('focuses on the focused day when showing the month view', async () => {
    expect(document.activeElement.textContent).not.toEqual('February')
    wrapper.setProps({
      showMonthView: true
    })
    await wrapper.vm.$nextTick()
    expect(document.activeElement.textContent).toEqual('February')
  })
})
