import { test, expect } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

const timetableHtmlPath = path.resolve(__dirname, '../timetable.html');
const timetableFileUrl = pathToFileURL(timetableHtmlPath).toString();

test.describe('주간 학원 시간표 편집 시나리오', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(timetableFileUrl);
  });

  test('빈 블록에 새로운 첫째 수업을 추가한다', async ({ page }) => {
    const student = '첫째';
    const academy = '코딩 학원';
    const timeRange = '19:00~20:00';

    page.on('dialog', async (dialog) => {
      const message = dialog.message();

      if (message.startsWith('수업명을 입력하세요')) {
        await dialog.accept(`${student}/${academy} (${timeRange})`);
      } else if (message.startsWith('색상 타입을 입력하세요')) {
        await dialog.accept('first');
      } else {
        await dialog.accept();
      }
    });

    // 비어 있는 블록을 하나 선택해서 클릭(선택 상태로만 두고)
    const emptyBlock = page.locator('.class.empty').first();
    await emptyBlock.click();

    // 항상 선택된 블록(선택 테두리 유지)을 기준으로 검증
    const targetBlock = page.locator('.class.selected');

    await page.getByRole('button', { name: '추가' }).click();

    await expect(targetBlock).toHaveClass(/first-class/);
    await expect(targetBlock).toContainText(student);
    await expect(targetBlock).toContainText(academy);
    await expect(targetBlock).toContainText(timeRange);
  });

  test('이미 있는 수업을 덮어쓴다', async ({ page }) => {
    const student = '둘째';
    const academy = '미술 학원';
    const timeRange = '16:00~17:00';

    page.on('dialog', async (dialog) => {
      const message = dialog.message();

      if (message.startsWith('이미 수업이 있어요')) {
        await dialog.accept(); // 덮어쓰기 확인
      } else if (message.startsWith('수업명을 입력하세요')) {
        await dialog.accept(`${student}/${academy} (${timeRange})`);
      } else if (message.startsWith('색상 타입을 입력하세요')) {
        await dialog.accept('second');
      } else {
        await dialog.accept();
      }
    });

    // 이미 수업이 있는 블록 선택 (예: 첫 번째 non-empty 블록)
    const existingBlock = page.locator('.class:not(.empty)').first();
    await existingBlock.click();

    const targetBlock = page.locator('.class.selected');

    await page.getByRole('button', { name: '추가' }).click();

    await expect(targetBlock).not.toHaveClass(/empty/);
    await expect(targetBlock).toContainText(student);
    await expect(targetBlock).toContainText(academy);
    await expect(targetBlock).toContainText(timeRange);
  });

  test('삭제 버튼으로 수업을 삭제한다', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      const message = dialog.message();

      if (message.startsWith('이 블록 내용을 삭제할까요')) {
        await dialog.accept();
      } else {
        await dialog.accept();
      }
    });

    // 이미 수업이 있는 블록 선택
    const existingBlock = page.locator('.class:not(.empty)').first();
    await existingBlock.click();

    const targetBlock = page.locator('.class.selected');

    await page.getByRole('button', { name: '삭제' }).click();

    await expect(targetBlock).toHaveClass(/empty/);
    await expect(targetBlock).toContainText('—');
  });
});

