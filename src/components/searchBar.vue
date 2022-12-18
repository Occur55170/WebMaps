<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

</script>

<template>
  <div class="row flex-wrap mx-0 col-2">
    <input type="text" placeholder="請輸入關鍵字">
    <ul class="list-unstyled d-flex align-items-center flex-nowrap">
      <li class="me-4">
        <a href="" class="text-white">
          <svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M16.466 7.5C15.643 4.237 13.952 2 12 2C9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2m2.194-8.093l3.814 1.86l-1.86 3.814"/><path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43c-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"/></g></svg>
        </a>
      </li>
      <li class="me-4">
        <a href="" class="text-white">
          <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3l5.571-3m-11.142 0L2.25 7.5L12 2.25l9.75 5.25l-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75L2.25 16.5l4.179-2.25m11.142 0l-5.571 3l-5.571-3"/></svg>
        </a>
      </li>
      <li class="me-4">
        <a href="" class="text-white">
          <svg viewBox="0 0 20 20"><path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5V5H4Zm12 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-5.5v10H16Zm-4.5-1a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Zm2.5-.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm1.5.5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z"/></svg>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
input{
  margin-bottom: 15px;
  border-radius: 20px;
  border: 0;
  padding: 10px 20px;
}
a{
  display: block;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  padding: 10px;
  box-sizing: border-box;
}
svg{
  font-size: 24px;
  width: 100%;
  height: 100%;
}
</style>
