echo off
echo ������������� ��������
taskkill /im cells.exe /f

echo �������������� ��������
taskkill /im gs.exe /f
taskkill /im world.exe /f
taskkill /im hall.exe /f


echo �˳���ϣ�2����˳���������̨
ECHO Wscript.Sleep(2000) > sleep.vbs
START /WAIT wscript.exe sleep.vbs
DEL /Q sleep.vbs
