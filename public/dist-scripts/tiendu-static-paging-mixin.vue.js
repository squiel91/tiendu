"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  props: {
    itemsPerPage: {
      type: Number,
      default: 6
    }
  },
  data: function data() {
    return {
      currentPage: 1
    };
  },

  computed: {
    pageItems: function pageItems() {
      return this.items && this.items.slice(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage * this.currentPage);
    },
    from: function from() {
      return this.itemsPerPage * (this.currentPage - 1) + 1;
    },
    to: function to() {
      return Math.min(this.totalItems, this.itemsPerPage * this.currentPage);
    },
    hasNext: function hasNext() {
      return this.itemsPerPage * this.currentPage < this.totalItems;
    },
    hasPrev: function hasPrev() {
      return this.currentPage > 1;
    },
    totalPages: function totalPages() {
      return Math.ceil(this.totalItems() / this.itemsPerPage);
    },
    totalItems: function totalItems() {
      return this.items ? this.items.length : 0;
    }
  }
};