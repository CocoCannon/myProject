echo off
echo ���������� ��������
taskkill /im CellsRobot.exe /f

echo �˳���ϣ�2����˳���������̨
ECHO Wscript.Sleep(2000) > sleep.vbs
START /WAIT wscript.exe sleep.vbs
DEL /Q sleep.vbs
