object Form1: TForm1
  Left = 192
  Top = 125
  Width = 384
  Height = 266
  Caption = 'Form1'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  PixelsPerInch = 96
  TextHeight = 13
  object Label1: TLabel
    Left = 194
    Top = 40
    Width = 32
    Height = 13
    Caption = 'Label1'
  end
  object Label2: TLabel
    Left = 257
    Top = 126
    Width = 32
    Height = 13
    Caption = 'Label2'
  end
  object Label3: TLabel
    Left = 40
    Top = 126
    Width = 35
    Height = 13
    Caption = 'Temps:'
  end
  object bGet: TButton
    Left = 112
    Top = 34
    Width = 65
    Height = 25
    Caption = 'Get'
    TabOrder = 0
    OnClick = bGetClick
  end
  object bPost: TButton
    Left = 168
    Top = 120
    Width = 75
    Height = 25
    Caption = 'Post'
    TabOrder = 1
    OnClick = bPostClick
  end
  object eTemps: TEdit
    Left = 87
    Top = 122
    Width = 57
    Height = 21
    TabOrder = 2
    Text = '10'
  end
  object IdHTTP1: TIdHTTP
    MaxLineAction = maException
    AllowCookies = True
    ProxyParams.BasicAuthentication = False
    ProxyParams.ProxyPort = 0
    Request.ContentLength = -1
    Request.ContentRangeEnd = 0
    Request.ContentRangeStart = 0
    Request.Accept = 'text/html, */*'
    Request.BasicAuthentication = False
    Request.UserAgent = 'Mozilla/3.0 (compatible; Indy Library)'
    HTTPOptions = [hoForceEncodeParams]
    Left = 16
    Top = 16
  end
end
